# Recipeep: Your Online Recipe Forum

## DESCRIPTION —
This is a discussion website that replicates the original purpose of forums such as Reddit. 
However, instead of traditional text/image posts that are organized by different subjects, 
this project focuses only on recipes. Registered users in the community can submit content/s 
in the forum but posts are only limited to food or drink recipes. This is because the main 
purpose of this project is to allow the members of the community to improve and share their 
cooking repertoire which can also inspire other users to do the same, and provide a healthy 
and progressive environment for individuals who have a passion for cooking.

## BY —
* Sean Timothy S. Co
* Lorraine Renee B. Cortel
* Dennis H. Lu

CCAPDEV - S14

## INTENDED MACHINE SPECIFICATIONS —
Link: https://tinyurl.com/S14MP12-IntendedSpecifications

## FEATURES —
For this phase of the project, the current working features involve:
* Upon opening the site, user will be greeted with the homepage. User can navigate homepage in logged out mode, but certain features are only available for logged in users like comment, rate, and creating a post.
* In the homepage, user is given the sorting of by new -- meaning posts made most recently are seen first.
* In the homepage, user can sort by popular, which is based on the current rating of all posts. Posts with highest stars will be seen first.
* In the homepage, user can sort by popular and by stars, which filters posts based on their star rating.
* In the homepage, if logged out user attempts to make a comment or rating, they will be redirected to login page.
* In the register page, user can create an account. Username, email, password, picture, and profile description are required.
* Once successful with registration, user will be redirected to login page to enter login credentials.
* In register page, if register credentials are already in the database, user will be prompted to change their username or email.
* In the login page, user can login if he/she has registered account.
* In the login page, if email or password is not recognized, prompt will come out and ask user to log in again.
* If user is logged in, he/she can log out whenever they want.
* If user is logged in, he/she can access his/her profile page via the icon in the navigation bar.
* User stays logged in even if they exit the site.
* User (even if logged in or logged out) can view the profile page of any user that has a post.
* Like in the homepage, user can sort by new and popular (and by stars) in the profile page, whether logged in or logged out.
* Logged in users can create a post.
* Logged in users can edit their own post.
* Logged in users stays logged in even after they exit the webpage.
* User (even if logged in or logged out) can view a post as long as they have the link to it or if they can click on it via any page in the app.
* User (even if logged in or logged out) can share a post via clicking the Share button. They will be given a URL of the page which they need to append to the main domain URL.
* Logged in users can put a comment on a post.
* Logged in users can edit their own comment.
* Logged in users can rate a post only once. Rating cannot be changed.
* User (even if logged in or logged out) can search for a post. Search is conducted by comparing the tags and search keyword and displaying posts where the same search keyword is found.
* User (even if logged in or logged out) can sort by new and popular (and by stars) in the search page.
* About page that contains npm packages and third-party libraries are found in the footer section.

## HOW TO RUN —
Since the application is already deployed to Heroku, you can access it by simply opening the link below.
> **https://recipeep-app.herokuapp.com**

## HOW TO RUN (FURTHER DETAILS  ) —

If you want, you can login using accounts made beforehand to check logged in features.

Account # 1:
```
Username: irenekim
Email: irenekim@email.com
Password: irenekim

Details: Has 5 posts in the account.
Profile URL: https://recipeep-app.herokuapp.com/viewUser/irenekim/new?page=1
```

Account # 2:
```
Username: officialgordon
Email: gordonramsay@official.com
Password: officialgordon

Details: Has 6 posts in the account.
Profile URL: https://recipeep-app.herokuapp.com/viewUser/officialgordon/new?page=1
```

Account # 3:
```
Username: seanko
Email: seanko@email.com
Password: seanko

Details: Has 4 posts in the account.
Profile URL: https://recipeep-app.herokuapp.com/viewUser/seanko/new?page=1
```

Account # 4:
```
Username: lorilorisee
Email: loricortel@email.com
Password: lorilorisee

Details: Has 0 post in the account.
Profile URL: https://recipeep-app.herokuapp.com/viewUser/lorilorisee/new?page=1
```

Account # 5:
```
Username: dennisluther
Email: dluther@email.com
Password: dennisluther

Details: Has 1 post in the account.
Profile URL: https://recipeep-app.herokuapp.com/viewUser/dennisluther/new?page=1
```

Account # 6:
```
Username: marklee
Email: marklee@email.com
Password: marklee

Details: Has 4 posts in the account.
Profile URL: https://recipeep-app.herokuapp.com/viewUser/marklee/new?page=1
```

Of course, you can also make you own account. 

Have fun navigating the site!

## DEPENDENCIES & LIBRARIES —
* bcryptjs                  2.4.3
* body-parser               1.19.0
* bootstrap-css             4.4.1
* bootstrap-js              4.4.1
* cookie-parser             1.4.5
* cors                      2.8.5
* dotenv                    8.2.0
* express                   4.17.1
* express-handlebars        3.1.0
* express-session           1.17.0
* gridfs-stream             1.1.1
* handlebars                4.7.6
* jquery                    3.4.1
* moment                    2.24.0
* mongodb                   3.5.5
* mongoose                  5.9.4
* mongoose-type-email       1.0.12
* mongoose-type-url         1.0.6
* multer                    1.4.2
* multer-gridfs-storage     4.0.2
* nodemon                   2.0.2
* passport                  0.4.1
* passport-local            1.0.0
* passport-local-mongoose   6.0.1
* popper                    1.16.0