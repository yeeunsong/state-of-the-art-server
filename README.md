# state-of-the-art-server
**State of the Art** is a web application game about masterpiece auction.    
Utilized **Vue.js and three.js** for frontend, and **Node.js, Express, and MySQL** for backend implementations.   
![workflow](https://user-images.githubusercontent.com/49232148/126420713-6bc21b27-0124-4bd8-891d-50e991bafe12.png)

   
The features include:
- Art Museum implemented with three.js
- Masterpiece auction 
- Game for earning auction money
- Mypage for listing collections and wishList
- ArtInfo page for setting my wishlist
- Register, login, and logout

**Code for frontend** is here: https://github.com/ChanyoungKim-kaist/state-of-the-art-client/tree/newmaster   
      
         
   
## FrontEnd Explanation 
### 1. Art Museum
Art museum for showning one's own collections.     
Made a 3D museum using Three.js, and page can be rotated vertically and horizontally.     
   
![museum](https://user-images.githubusercontent.com/49232148/126789043-71710031-1761-4ccb-8067-4c1849dd5f3f.gif)   
    
### 2. Auction 
Real-time art auction bidding page using socket programming, which multiple users can participate in the bidding.    
If one succeeds in bidding, the money he/she owns will be deducted accordingly.   
   
![bidding](https://user-images.githubusercontent.com/49232148/126788982-9361312b-3c93-4248-978b-6809c379ded2.gif)   
   
### 3. MiniGame
Users can earn money for auctions in MiniGame.   
   
![game](https://user-images.githubusercontent.com/49232148/126791832-cb123942-213a-4f35-959b-4dad1e80718d.gif)   
   
### 4. Wishlist
Users can select drawings and put in their wishlist. 
User's mypage gets updated accordingly after selection.   
   
![wishlist](https://user-images.githubusercontent.com/49232148/126788993-dc9d4314-d3aa-4300-8687-789e6b501f04.gif)   
   
### 5. Login/Register
Login/Register page. Utilized tokens for security.   
   
![login](https://user-images.githubusercontent.com/49232148/126788992-d1837ed8-3789-4d52-90db-87b9332b1801.gif)
      
         
## BackEnd Explanation
### 1. Socket Programming   
Socket programming was needed for real-time auction bidding of masterpieces.   
[npm ws (websocket)](https://www.npmjs.com/package/ws) package was used.
   
![슬라이드1](https://user-images.githubusercontent.com/49232148/126423037-f6da87a4-7122-40c8-835d-937ca460d3b0.JPG)

### 2. MySQL Database
MySQL tables for project database:   
   
![mysql table](https://user-images.githubusercontent.com/49232148/126421239-b6081cde-3fd0-4a27-926d-cb050b6e9d6b.png) 

      
         

## Contacts
Contributors   
- Yeeun Song, yeeunsong1019@gmail.com
- Chanyoung Kim, itnoj15@kaist.ac.kr
- Cassidy Nayeon Jung, friheyelow@kaist.ac.kr
