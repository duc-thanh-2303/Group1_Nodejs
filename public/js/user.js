import apiRequest from "./apirequest.js";


export class Post {
  constructor(data) {
    this.user = new User(data.user);
    this.time = new Date(data.time);
    this.text = data.text;
  }
}


export default class User {
  static async listUsers() {
    let data = await apiRequest("GET", "/users");
    console.log(data);
    return data.users;
  }


  static async loadOrCreate(id) {
    //TODO
    let users = await User.listUsers();
    let data = null;
    if (
      users.some((x) => { //kiểm tra xem id đã tồn tại trong ds users chưa
        return x === id;
      })
    ) {
      data = await apiRequest("GET", "/users/" + id); //lấy thông tin về người dùng có 'id' đã cho
      console.log(data);
    } else {
      // Tạo user mới nếu không tra cứu ra
      data = await apiRequest("POST", "/users", { id: id });
    }
    return new User(data);
  }


  constructor(data) {
    // TODO
    this.id = data.id;
    this.name = data.name;
    this.avatarURL = data.avatarURL;
    this.following = data.following;
  }


  toString() {
    return this.name;
  }


  toJSON() {
    // TODO
    return {
      id: this.id,
      name: this.name,
      avatarURL: this.avatarURL
    };
  }


  async save() {
    await apiRequest("PATCH", "/users/" + this.id, this);
  }


  async getFeed() {
    let res = [];
    let data = await apiRequest("GET", "/users/" + this.id + "/posts");
    //duyệt qua mỗi bài đăng từ data.posts
    for (let post of data.posts) {
      //tạo mới đối tượng Post từ dữ liệu của mỗi bài đăng và thêm vào mảng res
      res.push(new Post(post));
    }
    return res;
  }


  async makePost(text) {
    await apiRequest("POST", "/users/" + this.id + "/feed", { text: text });
  }


  async addFollow(id) {
    await apiRequest("POST", "/users/" + this.id + "/follow?target=" + id);
  }


  async deleteFollow(id) {
    await apiRequest("DELETE", "/users/" + this.id + "/follow?target=" + id);
  }
}

window.User = User;
