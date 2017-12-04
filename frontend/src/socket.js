class Socket {
  
  
  constructor(getMessage) {
    
    
    let socket = new Socket("/socket", {params: {token: window.userToken}})
    
    socket.connect();
    
    // Now that you are connected, you can join channels with a topic:
    let channel = socket.channel("updates:lobby", {})
    channel.join()
      .receive("ok", resp => { console.log("Joined successfully", resp) })
      .receive("error", resp => { console.log("Unable to join", resp) })
    
    channel.on("ping", getMessage);
    
    sendMessage(stars, reviewBody) {
      channel.push("ping", {
        stars: stars,
        reviewBody: reviewBody,
        classUID: classUID
      });
    }
        
    
  }
  
}
  

export default Socket;