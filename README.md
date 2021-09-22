# Social Media App Express PostgeSQL


First of all Cookies is not your business, the backend will handle them just set withCredentials to true


| Name | Value |
| ----------- | ----------- |
| JWT_SECRET | Set Random Secret key      |
| APIS_VERSION | 1 (Current) |
| DATABASE_URL | PostgreSQL cluster Url |  

<hr>

## Overview
* This app Build on Express.js PosgreSQL, Mocking the social media platform [Facebook.com](https://facebook.com)
* This app will contain  account
    - Explore <a href="#account">Account Apis</a>
        1.  Go to <a href="#register">Register</a> End point
        2.  Go to <a href="#login">Login</a> End Point
        3.  Go to <a href="#renew-token">Renew Token</a> End Point
        4.  Go to <a href="#delete-account">Delete Account</a> End Point

    - Explore <a href="#post">Post Apis</a>
        1.  Go to <a href="#create-post">Create Post </a> End point
        2.  Go to <a href="#edit-post">Edit Post</a> End Point
        3.  Go to <a href="#delete-post">Delete Post</a> End Point
        4.  Go to <a href="#show-post"># Show All Posts For A user</a>

    - Explore <a href="#chat">Chat Apis</a>
        1.  Go to <a href="#begin-chat">Begin Chat </a> End point
        2.  Go to <a href="#delete-chat">Delete Chat </a> End point

    - Explore <a href="#messages">Messages Apis</a>

## Dependencies
_____
| Package      | version |
| ----------- | ----------- |
| bcrypt      | 5.0.1       |
| cors | 2.8.5|
| dotenv | 10.0.0|
| email-validator | 2.0.4|
| express | 4.17.1|
| jsonwebtoken | 8.5.1|
| jwt | 0.2.0|
| moment | 2.29.1|
| pg | 8.7.1|
| sql-query-generator | 1.4.2|
| uuid | 8.3.2|
| socket io | 4.1.3 |

<hr>

<h2 id="account">Account</h2>

<details id="register">
  <summary>Register User</summary>

if username already Exist the request wil be directed to login route

```  
    Axios({
        method: "POST",
        url: /users/register,
        data: {
            username,
            password,
            first_name,
            last_name,
            email,
            day,
            month,
            year
        }
    }).then((res)  => {
        ... Do Some thing
    }).catch((error) => {
        ... Do Some thing
    })
```
</details>


<details id="login">
  <summary>Login</summary>

```  
    
    Axios({
        method: "POST",
        url: /users/login,
        data: {
            username,
            password
        }
    }).then((res)  => {
        ... Do Some thing
    }).catch((error) => {
        ... Do Some thing
    })

```
</details>




<details id="renew-token">
  <summary>Renew Token</summary>

```  
    Axios({
        method: "POST",
        url: /users/login,
        headers: {
            Authrization: Bearer <Token>
        }
    }).then((res)  => {
        ... Do Some thing
    }).catch((error) => {
        ... Do Some thing
    })

```
</details>

<hr>
<h2 id="post">Post</h2>

<details id="create-post">
  <summary>Create Post</summary>

```  
    
    Axios({
        method: "POST",
        url: /posts/create,
        headers: {
            Authrization: Bearer <Token>
        },
        data: {
            published, // Bollean define the status of the post Private ot Public
            content
        }
    }).then((res)  => {
        ... Do Some thing
    }).catch((error) => {
        ... Do Some thing
    })

```
```
{
    "NewPost": {
        "content": "44ssssssssssss",
        "user_id": 2,
        "id": "892"
    }
}
```
</details>


<details id="delete-post">
  <summary>Delete Post</summary>

```  
    Axios({
        method: "DELETE",
        url: /posts/delete,
        headers: {
            Authrization: Bearer <Token>
        },
        data: {
            post_id
        }
    }).then((res)  => {
        ... Do Some thing
    }).catch((error) => {
        ... Do Some thing
    })

```
</details>


<details id="edit-post">
  <summary>Edit Post</summary>

```  
    Axios({
        method: "POST",
        url: /posts/delete,
        headers: {
            Authrization: Bearer <Token>
        },
        data: {
            published, // New Post Status
            content // New Content
        }
    }).then((res)  => {
        ... Do Some thing
    }).catch((error) => {
        ... Do Some thing
    })

```
</details>



<details id="show-post">
  <summary>Show Post</summary>

```  
    
    Axios({
        method: "GET",
        url: /posts/:post_id,
        headers: {
            Authrization: Bearer <Token>
        },
    }).then((res)  => {
        ... Do Some thing
    }).catch((error) => {
        ... Do Some thing
    })

```
</details>


<details id="show-user-posts">
  <summary>Show All Posts For A user</summary>

```  
 
    Axios({  
        method: "GET",  
        url: /posts/:user_id/:round,  
        headers: {  
            Authrization: Bearer < Token>  
        },
    }).then((res)  => {
        ... Do Some thing
    }).catch((error) => {
        ... Do Some thing
    })

```
- `round` must be a `Number` specifies how many posts should i `skip`
- if round  is `0` the end point will Return the last `5` posts this user have posted
- if round  is `1` the end point will Skip the first `(1 * 5) = 5` posts and will Return posts from 5 to 10
- if round  is `2` the end point will Skip the first `(2 * 5) = 5` posts and will Return posts from 10 to 15
- if there is `no` more posts the endpoint will return empty Array []  
</details>
<hr>
<h2 id="chat">Chat</h2>

<details id="begin-chat">
  <summary>Create Chat</summary>

```  
    Axios({
        method: "POST",
        url: /chat/create,
        data: {
            chat_with, // id for the user that will chat with
        },
        headers: {
            Authrization : Beare <TOEKEN>
        }
    }).then((res)  => {
        ... Do Some thing
    }).catch((error) => {
        ... Do Some thing
    })
```
</details>


<details id="delete-chat">
  <summary>Delete Chat</summary>

```  
    Axios({
        method: "DELETE",
        url: /chat/delete,
        headers: {
            chat_id,
            Authrization : Beare <TOEKEN>
        }
    }).then((res)  => {
        ... Do Some thing
    }).catch((error) => {
        ... Do Some thing
    })
```
</details>
<hr>
<h2 id="messages">Messages</h2>

<details id="send-message">
  <summary>Send Message</summary>

```  
    Axios({
        method: "POST",
        url: "/messages/send",
        headers: {
            Authrization : Beare <TOEKEN>
        },
        data: {
            chat_id,
            content,
            chat_with
        }
    }).then((res)  => {
        ... Do Some thing
    }).catch((error) => {
        ... Do Some thing
    })
```
</details>


<details id="edit-message">
  <summary>Edit Message</summary>

```  
    Axios({
        method: "PUT",
        url: "/messages/edit",
        headers: {
            Authrization : Beare <TOEKEN>
        },
        data: {
            messege_id,
            chat_id,
            content
        }
    }).then((res)  => {
        ... Do Some thing
    }).catch((error) => {
        ... Do Some thing
    })
```
</details>


<details id="delete-message">
  <summary>Delete Message</summary>

```  
    Axios({
        method: "DELETE",
        url: "/messages/delete",
        headers: {
            Authrization : Beare <TOEKEN>,
            messege_id
        }
    }).then((res)  => {
        ... Do Some thing
    }).catch((error) => {
        ... Do Some thing
    })
```
</details>
<hr>
<h2 id="comments">Comments</h2>


<details id="create-comment">
  <summary>Create Comment</summary>

```  
    Axios({
        method: "POST",
        url: "/comments/create",
        headers: {
            Authrization : Beare <TOEKEN>,
        },
        data: {
            content,
            post_id
        }
    }).then((res)  => {
        ... Do Some thing
    }).catch((error) => {
        ... Do Some thing
    })
```
</details>


<details id="edit-comment">
  <summary>Edit Comment</summary>

```  
    Axios({
        method: "POST",
        url: "/comments/edit",
        headers: {
            Authrization : Beare <TOEKEN>,
        },
        data: {
            content,
            comment_id
        }
    }).then((res)  => {
        ... Do Some thing
    }).catch((error) => {
        ... Do Some thing
    })
```
</details>


<details id="delete-comment">
  <summary>Delete Comment</summary>

```  
    Axios({
        method: "DELETE",
        url: "/comments/edit",
        headers: {
            Authrization : Beare <TOEKEN>,
            comment_id
        }
    }).then((res)  => {
        ... Do Some thing
    }).catch((error) => {
        ... Do Some thing
    })
```
</details>



<details id="get-post-comment">
  <summary>Get Post Comments</summary>

```  
    Axios({
        method: "GET",
        url: "/comments/post_comments/:post_id/:round",
        headers: {
            Authrization : Beare <TOEKEN>,
        }
    }).then((res)  => {
        ... Do Some thing
    }).catch((error) => {
        ... Do Some thing
    })
```
</details>

<hr>
<h2 id="replies">Replies</h2>


<details id="create-reply">
  <summary>Create Reply</summary>

```  
    Axios({
        method: "POST",
        url: "/replies/create",
        headers: {
            Authrization : Beare <TOEKEN>,
        },
        data: {
            content,
            comment_id,
            post_id
        }
    }).then((res)  => {
        ... Do Some thing
    }).catch((error) => {
        ... Do Some thing
    })
```
</details>


<details id="edit-comment">
  <summary>Edit Comment</summary>

```  
    Axios({
        method: "POST",
        url: "/replies/edit",
        headers: {
            Authrization : Beare <TOEKEN>,
        },
        data: {
            content,
            reply_id
        }
    }).then((res)  => {
        ... Do Some thing
    }).catch((error) => {
        ... Do Some thing
    })
```
</details>


<details id="delete-comment">
  <summary>Delete Comment</summary>

```  
    Axios({
        method: "DELETE",
        url: "/replies/delete",
        headers: {
            Authrization : Beare <TOEKEN>,
            reply_id
        }
    }).then((res)  => {
        ... Do Some thing
    }).catch((error) => {
        ... Do Some thing
    })
```
</details>


