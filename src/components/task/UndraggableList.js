import React from "react";
import { withStyles } from "@material-ui/core/styles";
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';
import EditIcon from '@material-ui/icons/Edit';
import CancelIcon from '@material-ui/icons/Cancel';
import TextField from "@material-ui/core/TextField";

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

class UndraggableList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isedit: false,
            taskname: props.task.taskname
        }
    }
    handleToggle = () => {
        this.props.markComplete(this.props.task.taskid);
    }

    deleteTask = () => {
        this.props.deleteTask(this.props.task.taskid);
    }

    editTask = () => {
        this.setState({ isedit: true })
    }

    saveTask = () => {
        this.props.saveTask(this.props.task.taskid, this.state.taskname);
        this.setState({ isedit: false })
    }

    canceltask = () => {
        this.setState({ isedit: false, taskname: this.props.task.taskname })
    }
    handleChange = event => {
        var val = event.target.value;
        this.setState({
            [event.target.name]: val
        });
    };

    render() {
        const labelId = `checkbox-list-label-${this.props.task.taskid}`;
        return (
                    <ListItem
                        key={this.props.task.taskid}
                        role={undefined} dense button
                        style={{ background: '#81c784',marginTop: 5}}>
                        <ListItemIcon>
                            <Checkbox
                                onChange={this.handleToggle}
                                edge="start"
                                checked={this.props.task.iscomplete}
                                tabIndex={-1}
                                disableRipple
                                inputProps={{ 'aria-labelledby': labelId }}
                            />
                        </ListItemIcon>
                {this.state.isedit ?
                    <TextField
                        variant="outlined"
                        margin="normal"
                        name="taskname"
                        label="Task"
                        type="text"
                        id="taskname"
                        size="small"
                        style={{ margin: 10 }}
                        onChange={this.handleChange}
                        value={this.state.taskname}
                        inputProps={{ maxLength: 500 }}
                    /> :
                    <ListItemText id={this.props.task.taskid} primary={this.props.task.taskname} />
                }
                {this.state.isedit ?
                    <ListItemSecondaryAction>

                        <IconButton edge="end" aria-label="edit task" onClick={this.canceltask} style={{ marginRight: 20 }}>
                            <CancelIcon />
                        </IconButton>

                        <IconButton edge="end" aria-label="delete task" onClick={this.saveTask}>
                            <SaveIcon />
                        </IconButton>
                    </ListItemSecondaryAction> :
                    <ListItemSecondaryAction>
                        <IconButton edge="end" aria-label="edit task" onClick={this.editTask} style={{ marginRight: 20 }}>
                            <EditIcon />
                        </IconButton>

                        <IconButton edge="end" aria-label="delete task" onClick={this.deleteTask}>
                            <DeleteIcon />
                        </IconButton>
                    </ListItemSecondaryAction>
                }
                    </ListItem>
        )
    }
}

export default withStyles(styles)(UndraggableList);