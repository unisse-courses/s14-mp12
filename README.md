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
* View homepage posts as is.
* User can register for an account.
* User can login if he/she has an account.
* User can logout from a logged in account.
* User can view a profile page of a registed user.
* If logged in, user can view his/her own profile page through his/her icon or username.
* Logged in user can create a post.
* Users can click on a post's title to view full post.
* Logged in user can post a comment.
* Logged in user can rate a post.

## HOW TO RUN —
Since the application is already deployed to Heroku, you can access it by simply opening the link below.
1. Go to `https://recipeep-app.herokuapp.com`.

> **https://recipeep-app.herokuapp.com**

* * *

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

Of course, you can also make you own account. Have fun navigating the site!

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