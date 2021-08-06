export default getConfig();

function getConfig() {
    let config = {};
    if (process.env.NODE_ENV === 'production') {
        config = {
            url: "https://course-app-backend.herokuapp.com",
            listurl: "https://s3-ap-southeast-1.amazonaws.com/he-public-data/courses26269ff.json"
        }
    }
    else {
        config = {
            url: "",
            listurl: "https://s3-ap-southeast-1.amazonaws.com/he-public-data/courses26269ff.json"
        }
    }
    return config;
}