# Blog-MERN

Blog website using MERN stack (Work in Progress)

**Technologies Used**

- JavaScript
- TensorFlow Js (To make sure the user registering is human and not a bot)
- Google OAuth
- Redux-Persist
- Tailwind CSS
- React-Router-DOM (for the routing functionalities)
- React-Quill (For the text Editor)
- React-Logo (For the logos and symbols)
- React-Circular-Progressbar (To give the loading effects)
- Flowbite-React (For beautiful HTML elements)

**Installation Steps**

1. Clone the repository

```bash
   git clone https://github.com/mihirvaidya221998/Blog-MERN.git
```

2. Navigate to the project directory

```bash
    cd Blog-MERN
```

3. Install the neccessary requirements for the backend side of the project

```bash
    npm install
```

4. Now navigate to the front-end using the command

```bash
    cd blog_client
```

5. Install the neccessary requirements for the front-end side of the project

```bash
    npm install
```

6. Now go back to the back-end

```bash
    cd ..
```

7. Run the back-end using the command

```bash
    npm run dev
```

8. Open another terminal and go to the front-end directory

```bash
    cd blog_client
```

9. Over here run the front-end as follows:

```bash
    npm run dev
```

10. Go to the URL http://localhost:5173/ to go to the landing page of the website.

**Features Implemented as of Now**

1. User can sign-up using their personal mail or by using their google account.
2. The person registering has to have a front-camera and they need to complete identity verification to show they are humans and not bots. This feature is done using TensorFlowJS. The website captures a photo using the user's webcam and then uses the CoCo-SSD model of TensorFlow(Object Detection Model) to create a score. If the score is above certain value then the user is verified as human.
3. The Admin is the only person who can write the blogs. Admin access is as follows:

   - Email: admin@gmail.com
   - Password: admin@1234

4. The users can update their account information, change their profile picture and Delete their accounts.
