import User = require('../models/user');
import Task = require('../models/task');
import Post = require('../models/post');

export function upsertUser (accessToken: any, refreshToken: any, profile: any, done: any) {
    try {
        User.findOne({
            fbUserId: profile.id
        }).then( user => {
            if (user) {
                done(null, user);
            }
            else {
                let date = new Date();
                const newUser = {
                    fbUserId: profile.id,
                    fbToken: accessToken,
                    name: profile.name.givenName + " " + profile.name.familyName,
                    email: profile.emails[0].value,
                    registerDate: date,
                    refCode: (Math.random() + 0.00000001).toString(36).substring(2, 10).toUpperCase()
                };
                new User(newUser).save().then(user => done(null, user));
            }
        });
    }
    catch (error) {
        console.log("Auth Error:", error);
        done(null, false);
    }
}


//
//
// Creates Sample data, Strictly for debug purpose
export function createSampleTask() {
    const task  = {
        taskTitle: "Sample Task",
        taskContent: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat",
        points: 250,
        expTime: new Date()
    };
    new Task(task).save();
}

export function createSamplePost() {
    const post  = {
        fbURL: "https://www.facebook.com/ecelliitk/photos/a.145084105509611/3074330189251640/?type=3&permPage=1",
        imageURL: "https://scontent-bom1-1.xx.fbcdn.net/v/t1.0-9/65914796_3074330202584972_8196570747951382528_o.png?_nc_cat=107&_nc_oc=AQmMSWspYZeQejr7Sws8mPygxCkUncRVPsLGg2X4vVU0p_gMVNl1acWBsXvMdSRAzXE&_nc_ht=scontent-bom1-1.xx&oh=d4b41f3e5dbc87aad7f9b3d6889da87f&oe=5DBBD0F3",
        content: "Looking for one stop solution for funding, mentorship or incubation for your Start-up? Entrepreneurship Cell, IIT Kanpur presents to you UpStart, The Indian Business Model competition, to cater all your needs. This year, through our initiative, UpStart-Nationals, we strive to reach out to startup-geeks all over the nation to pitch their ideas before the best crew of venture capitalists ...",
        expTime: new Date()
    };
    new Post(post).save();
}