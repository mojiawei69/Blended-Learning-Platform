const URL = {
  dev : {
    uri : "http://192.168.159.40", // api url
    port : 3000
  }, 
  local: {
    uri : "http://localhost",
    port: 8080
  }
}

const local = true;
// view url http://192.168.159.25:3000

export const baseURL = {
  //Api Url
  Api : local ? URL.local : URL.dev 
}