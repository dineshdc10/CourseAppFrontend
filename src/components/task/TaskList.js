import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { removeState } from "../../localStorage";
import SnackBar from "../common/snackBar";
import { withRouter } from "react-router-dom";
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import DraggableList from './DraggableList';
import UndraggableList from './UndraggableList';
import List from '@material-ui/core/List';

const styles = theme => ({
    paper: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    },
    card: {
        marginTop: "20px"
    },
    form: {
        display: "flex",
        flexWrap: "wrap"
    },

    avatar: {
        margin: 10
    }
});

class TaskList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pendingtasklist: [],
            completetasklist: [],
            classes: props.classes,
            message: "",
            taskname:"",
        };
    }

    componentDidMount() {
        this.gettasklist();
    }

    //Maintain state with change in input
    handleChange = event => {
        var val = event.target.value;
        this.setState({
            [event.target.name]: val
        });
    };

    handleRes = res => {
        if (res.ok) {
            return res.json();
        } else {
            if (res.status === 401) {
                removeState();
                this.props.history.push("/error/loginRequired");
            } else if (res.status === 403) {
                this.props.history.push("/error/unAuthorized");
            } else {
                this.setSnack("Sorry,we are unable to serve you now!!" )
            }
        }
    };

    gettasklist = () => {
        fetch("/task/getlist", {
                method: "GET",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then(res => {
                    return this.handleRes(res);
                })
                .then(data => {
                    if (data && data.records) {
                        var pendingtasklist = [];
                        var completetasklist = [];
                        for (var i = 0; i < data.records.length; i++){
                            if (data.records[i].iscomplete) {
                                completetasklist.push(data.records[i]);
                            }
                            else {
                                pendingtasklist.push(data.records[i]);
                            }
                        }
                        this.setState({
                            pendingtasklist,
                            completetasklist
                        })
                    }
                    else {
                        this.setSnack("Failed to fetch task list!!");
                    }
                })
            .catch((err) => {
                this.setSnack("Sorry,we are unable to serve you now!!")
            });
       
    };

    onDragEnd = (result) => {
        const { destination, source } = result;
        if (!destination) {
            return;
        }

        if (destination.droppableId === source.droppableId
            && destination.index === source.index) {
            return;
        }

        var pendingtasklist = Object.assign(this.state.pendingtasklist, []);
        
        var sptask = pendingtasklist.splice(source.index, 1);
        pendingtasklist.splice(destination.index, 0, sptask[0]);
       
        for (var i = 0; i < pendingtasklist.length; i++){
            pendingtasklist[i].orderid = i;
        }
        this.arrangeOrder(pendingtasklist);
    }

    arrangeOrder = (pendingtasklist) => {
        fetch("/task/arrange", {
            method: "POST",
            body: JSON.stringify({
                pendingtasklist : pendingtasklist,
            }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then(res => {
                return this.handleRes(res);
            })
            .then(data => {
                if (data && data.success) {
                    this.setState({
                        pendingtasklist
                    })
                } else {
                    this.setSnack("Failed to arrange!!");
                }
            }).catch((err) => {
                this.setSnack("Sorry,we are unable to serve you now!!")
            });;
    }

    handleAdd = () => {
        if (this.state.taskname.trim() !== "") {
            fetch("/task/createtask", {
                method: "POST",
                body: JSON.stringify({
                    taskname: this.state.taskname,
                }),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then(res => {
                    return this.handleRes(res);
                })
                .then(data => {
                    if (data && data.success) {
                        var pendingtasklist = Object.assign(this.state.pendingtasklist, []);
                        pendingtasklist.push(data.task);
                        this.setState({
                            pendingtasklist: pendingtasklist,
                            taskname: ""
                        })
                        this.setSnack("New task added!!");
                    } else {
                        this.setSnack("Failed to add!!");
                    }
                }).catch((err) => {
                    this.setSnack("Sorry,we are unable to serve you now!!")
                });
        }
        else {
            this.setSnack("Please add a task in the field!!")
        }

    }

    markComplete = (taskid) => {
        var pendingtasklist = Object.assign(this.state.pendingtasklist, []);
        var isComplete = false;
        var found = false;
        var task = [];
        for (var i = 0; i < pendingtasklist.length; i++){
            if (pendingtasklist[i].taskid === taskid) {
                isComplete = !pendingtasklist[i].iscomplete;
                pendingtasklist[i].iscomplete = isComplete;
                found = true;
                task = pendingtasklist.splice(i, 1);
                break;
            }
        }
        var completetasklist = Object.assign(this.state.completetasklist, []);
        if (found)
        {
            completetasklist.push(task[0]);
        }
        else {
            for (var i = 0; i < completetasklist.length; i++) {
                if (completetasklist[i].taskid === taskid) {
                    isComplete = !completetasklist[i].iscomplete;
                    completetasklist[i].iscomplete = isComplete;
                    found = true;
                    task = completetasklist.splice(i, 1);
                    break;
                }
            }
            if (found) {
                pendingtasklist.push(task[0]);
            }
        }
        
        

        fetch("/task/completetask", {
            method: "POST",
            body: JSON.stringify({
                taskid: taskid,
                iscomplete: isComplete
            }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then(res => {
                return this.handleRes(res);
            })
            .then(data => {
                if (data.success) {
                    this.setState({
                        pendingtasklist: pendingtasklist,
                        completetasklist: completetasklist
                    })
                    if (isComplete) {
                        this.setSnack("Task marked as completed!!");
                    }
                    else {
                        this.setSnack("Task marked as pending!!");
                    }
                } else {
                    this.setSnack("Failed to update!!");
                }
            }).catch((err) => {
                this.setSnack("Sorry,we are unable to serve you now!!")
            });

    }

    deleteTask = (taskid) => {
        var pendingtasklist = Object.assign(this.state.pendingtasklist, []);
        var index = -1;
        for (var i = 0; i < pendingtasklist.length; i++) {
            if (pendingtasklist[i].taskid === taskid) {
                index = i;
                break;
            }
        }
        var completetasklist = Object.assign(this.state.completetasklist, []);
        if (index === -1) {
            for (var i = 0; i < completetasklist.length; i++) {
                if (completetasklist[i].taskid === taskid) {
                    index = i;
                    break;
                }
            }
            if (index !== -1) {
                completetasklist.splice(index, 1);
            }
        }
        else
        {
            pendingtasklist.splice(index, 1);
        }
        
       
        fetch("/task/removetask", {
            method: "POST",
            body: JSON.stringify({
                taskid: taskid
            }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then(res => {
                return this.handleRes(res);
            })
            .then(data => {
                if (data.success) {
                    this.setState({
                        completetasklist: completetasklist,
                        pendingtasklist: pendingtasklist
                    })
                    this.setSnack("Task deleted successfully!!");
                } else {
                    this.setSnack("Failed to delete!!");
                }
            }).catch((err) => {
                this.setSnack("Sorry,we are unable to serve you now!!")
            });

    }

    saveTask = (taskid, taskname) => {
        var pendingtasklist = Object.assign(this.state.pendingtasklist, []);
        for (var i = 0; i < pendingtasklist.length; i++) {
            if (pendingtasklist[i].taskid === taskid) {
                pendingtasklist[i].taskname = taskname;
                break;
            }
        }
        var completetasklist = Object.assign(this.state.completetasklist, []);
        for (var i = 0; i < completetasklist.length; i++) {
            if (completetasklist[i].taskid === taskid) {
                completetasklist[i].taskname = taskname;
                break;
            }
        }
        fetch("/task/updatetask", {
            method: "POST",
            body: JSON.stringify({
                taskid: taskid,
                taskname: taskname
            }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then(res => {
                return this.handleRes(res);
            })
            .then(data => {
                if (data.success) {
                    this.setState({
                        pendingtasklist: pendingtasklist,
                        completetasklist: completetasklist
                    })
                    this.setSnack("Task Updated successfully!!");
                } else {
                    this.setSnack("Failed to update!!");
                }
            }).catch((err) => {
                this.setSnack("Sorry,we are unable to serve you now!!")
            });
    }


    setSnack = message => {
        this.setState({ message });
    };

    render() {
        const classes = this.props.classes;
        return (
            <React.Fragment>
                 <SnackBar
                    message={this.state.message}
                    closeSnackBar={() => this.setState({ message: "" })}
                />
                <Grid container spacing={1} style={{marginTop: 10}}>
                    <Grid item xs={12} sm={6} md={9} style={{ display: 'flex', alignItems: 'center', alignContent: 'left' }}>
                        <Typography variant="h6" className={classes.title}>
                            Task List
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3} style={{display : 'flex', alignItems: 'center',alignContent: 'center' }}>
                        <TextField
                                variant="outlined"
                                margin="normal"
                                fullWidth
                                name="taskname"
                                label="Task"
                                type="text"
                                id="taskname"
                                size="small"
                                style={{ margin: 10 }}
                                onChange={this.handleChange}
                                value={this.state.taskname}
                                inputProps={{ maxLength: 500 }}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            style={{ margin: 10 }}
                            onClick={this.handleAdd}
                        >
                            Add
                        </Button>
                    </Grid>
               
                <Grid item xs={12} sm={12} md={12} style={{ display: 'flex', alignItems: 'center', alignContent: 'center' }}>
                    
                    </Grid>
                </Grid>
                <List>
                    <DragDropContext
                        onDragEnd={this.onDragEnd}
                    >
                        <Droppable droppableId="taskdropable">
                            {(provided, snapshot) => (
                                <div
                                    ref={provided.innerRef}
                                    style={{ backgroundColor: snapshot.isDraggingOver ? 'white' : 'white' }}
                                    {...provided.droppableProps}
                                >
                                    {this.state.pendingtasklist.map((task, index) => {
                                        return <DraggableList task={task} index={index} saveTask={this.saveTask}
                                            markComplete={this.markComplete} deleteTask={this.deleteTask} />
                                    })
                                    }
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                    {this.state.completetasklist.map((task, index) => {
                        return <UndraggableList task={task} index={index} saveTask={this.saveTask}
                            markComplete={this.markComplete} deleteTask={this.deleteTask} />
                    })
                    }
                </List>
            </React.Fragment>
        );
    }
}

export default withRouter(withStyles(styles)(TaskList));
