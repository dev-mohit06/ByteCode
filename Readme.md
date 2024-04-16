# ByteCode

## Author
- [@dev-mohit06](https://www.github.com/dev-mohit06)

## Fullstack MERN Blogging Website
This website features include -
1. Modern Blog Editor using Editor JS.
2. Google Authentication for Users
3. Dynamic Blog Pages on dynamic urls.
4. Search Page for Searching Blogs & users.
5. Dedicated Users Profile with thier social links and written blogs.
6. Dedicated dashboard to manage blogs either published or draft.
7. Blog Post Analytics, editable and deletable.
8. Like interaction on Blogs with feature to comment on the blog.
9. Reply to comments. ( A nested Comment System )
10. Every interaction on site stores as a notification for their respective users.
11. Recent notification highlight separating them from old notifications.
12. Edit profile option to update social links, bio and username
13. Also user can change login password from settings.
14. Its mobile responsive with modern design + fade in animation on pages.
And theme support.

# Setup Requirement

### Server
* You have an install node js and npm which is latest
* You have an account on aws
* create s3 bucket and after the goto permisson tab and there allow put and get persmison policy to secure you bucket

* after that you need to create on iam user and allow cli access and also allow all permisson for s3 bucket to manage it
* now clone the repo
* navigate to server directory ``` cd server ```
* run the ``` npm i ```
* after that goto [Firebase](https://firebase.google.com/)
* create new project and go to authentication secation and turn on google authentication and after that go to setting an downlaod you firebase crediantion file
* navigate to config directory insider server ``` cd ./server/config/ ```
* create one file named ``` firebase-admin-config.js ```
* copy you firebase crediantion json object and replace with the given
```
const firebaseConfig = // Your copyed json object

export default firebaseConfig;
```

### client
* navigate to config directory insider server ``` cd ./client/
* run the ``` npm i ```
* goto the commen and replace you config with mine to run google authentication other wise project will working

### comman instruction
* create .env file in both project you have and .env.example put you crediantion