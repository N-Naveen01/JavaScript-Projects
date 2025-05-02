
const container = document.querySelector(".container")
const ChatsContainer = document.querySelector(".chats-container");
const promptForm = document.querySelector(".prompt-form");
const promptInput= promptForm.querySelector(".prompt-input");
const fileInput = promptForm.querySelector("#file-input");
const fileUploadWrapper = promptForm.querySelector(".file-upload-wrapper");
const themeToggle = document.querySelector("#theme-toggle-btn");

const API_KEY="AIzaSyCt7XNyV30-OkeaLoGDNkSpbT9HVK7cFjo";
const API_URL=`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`


let typingInterval, controller;
const chatHistory=[];

const userData= {message: "", file:{}};


 //function to create message elements
const CreateMsgElement= (content, ...Classes) =>{
    const div=document.createElement("div");
    div.classList.add("message",...Classes);
    div.innerHTML=content;
    return div;
}

//scroll to bottom of container
const scrollToBottom =() =>container.scrollTo({top: container.scrollHeight, behavior:"smooth"});


//simulate type effect for bot response
const typingEffect=(text,textElement,botMsgDiv) => {
    textElement.textContent="";
    const words=text.split(" ");
    let wordIndex =0;

    //set an interval to type each word

    typingInterval = setInterval(() =>{
        if(wordIndex<words.length){
            textElement.textContent+=(wordIndex ===0 ? "" : " ")+words[wordIndex++];
            scrollToBottom();
        }
        else{
            clearInterval(typingInterval);
            botMsgDiv.classList.remove("loading");
            document.body.classList.remove("bot-responding");
            
        }
    },40);
}


// Make api call and generate bot response

const generateResponse =async(botMsgDiv) =>{

    const textElement = botMsgDiv.querySelector(".message-text");
    controller= new AbortController();

    //Add usermessage to chatHistory

    chatHistory.push({
        role:"user",
        parts:[{text: userData.message}, ...(userData.file.data ? [{ inline_data : (({fileName,isImage, ...rest}) => rest) (userData.file)}] :[])]
    });

    const requestBody = { contents: chatHistory };
    console.log("API Request:", requestBody);    

    try{
        const response = await fetch(API_URL,{
            method:"POST",
            headers:{"Content-Type": "application/json"},
            body: JSON.stringify({contents:chatHistory}),
            signal:controller.signal
        });

        const data= await response.json();
        if(!response.ok){
            throw new Error(data.error.message);
        }
        const responseText = data.candidates[0].content.parts[0].text.replace(/\*\*([^*]+)\*\*/g,"$1").trim();

        // process the response text and display with typing effect
        
        typingEffect(responseText,textElement,botMsgDiv);

        chatHistory.push({
            role:"model",
            parts:[{text: responseText}]
        });

    }
    catch(error){
        textElement.style.color="#d62939"; 
        textElement.textContent = error.name === "AbortError" ? "Response generation stopped." : error.message;
        botMsgDiv.classList.remove("loading");
        document.body.classList.remove("bot-responding");
        scrollToBottom();
    }
    finally{
        userData.file={};
    }
}

//handle form submission//

const handleFormSubmit = (e) => {
    e.preventDefault();
    const userMessage=promptInput.value.trim();

    if(!userMessage || document.body.classList.contains("bot-responding")  ) return;

    promptInput.value="";
    userData.message=userMessage;
    document.body.classList.add("bot-responding","chats-active");
    fileUploadWrapper.classList.remove("active","img-attached" ,"file-attached");

    //Generate user message HTML with optional file attachment


    const userMsgHTML = `<p class="message-text"></p> 
    ${userData.file.data ?  (userData.file.isImage ?   `<img src="data:${userData.file.mime_type};base64,${userData.file.data}" 
    class="img-attachment" />` : `<p class="file-attachment"> <span class="material-symbols-rounded">description</span> 
    ${userData.file.fileName} </p>`  )  :  "" }`;


    const userMsgDiv=CreateMsgElement(userMsgHTML,"user-message");

    userMsgDiv.querySelector(".message-text").textContent=userMessage;
    ChatsContainer.appendChild(userMsgDiv);
    scrollToBottom();


    setTimeout(() => {

        //generate bot message html and css in the charts container in 600ms 

        const botMsgHTML=`<img src="gemini.svg" class="avatar"><p class="message-text">Jus a sec...</p>`
        const botMsgDiv=CreateMsgElement(botMsgHTML,"bot-message","loading");
        ChatsContainer.appendChild(botMsgDiv); 
        scrollToBottom();
        generateResponse(botMsgDiv);
    },600);

}

fileInput.addEventListener("change", () =>{
    const file=fileInput.files[0];
    if(!file) return;

    const isImage = file.type.startsWith("image/");
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload=(e) => {
        fileInput.value="";
        const base64String = e.target.result.split(",")[1];
        fileUploadWrapper.querySelector(".file-preview").src=e.target.result;
        fileUploadWrapper.classList.add("active",isImage ? "img-attached" : "file-attached");

        //Stores file data in userData obj

        userData.file={fileName: file.name, data:base64String, mime_type: file.type, isImage};
    }
});

//cancel file upload
document.querySelector("#cancel-file-btn").addEventListener("click" ,() => {

    userData.file={};

    fileUploadWrapper.classList.remove("active","img-attached" ,"file-attached");
});

//stop ongoing bot response

document.querySelector("#stop-response-btn").addEventListener("click" ,() => {

    userData.file={};
    controller?.abort();
    clearInterval(typingInterval);
    ChatsContainer.querySelector(".bot-message.loading").classList.remove("loading");
    document.body.classList.remove("bot-responding");   
});

//delete all chats

document.querySelector("#delete-chats-btn").addEventListener("click" ,() => {

    chatHistory.length=0;
    ChatsContainer.innerHTML="";
    document.body.classList.remove("bot-responding","chats-active");  
});

//handle suggestion click 

document.querySelectorAll(".suggestions-item").forEach(item => {
    item.addEventListener("click" , () =>{
        promptInput.value = item.querySelector(".text").textContent;
        promptForm.dispatchEvent(new Event("submit"));
    });
});


//mobile settings

document.addEventListener("click", ({target}) => {
    const wrapper = document.querySelectorAll(".prompt-wrapper");
    const shouldHide = target.classList.contains("prompt-input") || (wrapper.classList.contains
    ("hide-controls") && (target.id === "add-file-btn"  || target.id === "stop-response-btn") );
    wrapper.classList.toggle("hide-controls",shouldHide);
});

//toggle dark or light theme

themeToggle.addEventListener("click", () => {
    const isLightTheme= document.body.classList.toggle("light-theme");
    localStorage.setItem("themeColor", isLightTheme? "light_mode" : "dark_mode");
    themeToggle.textContent=isLightTheme ? "dark_mode" : "light_mode";
});

// set initial theme for local storage
const isLightTheme= localStorage.getItem("themecolor") === "light_mode";
document.body.classList.toggle("light-theme", isLightTheme);
themeToggle.textContent=isLightTheme ? "dark_mode" : "light_mode";

promptForm.addEventListener("submit",handleFormSubmit); 

promptForm.querySelector("#add-file-btn").addEventListener("click", () => fileInput.click());