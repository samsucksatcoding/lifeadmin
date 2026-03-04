
const db = JSON.parse(localStorage.getItem("lifeAdmin")) || {
documents:[],
subscriptions:[],
vehicles:[],
medical:[],
reminders:[]
};

function save(){localStorage.setItem("lifeAdmin",JSON.stringify(db));}

const modal=document.getElementById("modal");
const titleInput=document.getElementById("titleInput");
const expiryInput=document.getElementById("expiryInput");
const fileInput=document.getElementById("fileInput");

let currentPage="dashboard";

document.querySelectorAll(".sidebar a").forEach(link=>{
link.onclick=()=>{
document.querySelectorAll(".sidebar a").forEach(l=>l.classList.remove("active"));
link.classList.add("active");

currentPage=link.dataset.page;

document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
document.getElementById(currentPage).classList.add("active");
document.getElementById("pageTitle").innerText=link.innerText.trim();
render(currentPage);
};
});

document.getElementById("addBtn").onclick=()=>{
if(currentPage==="dashboard")return;
modal.classList.remove("hidden");
};

document.getElementById("cancelBtn").onclick=()=>{
modal.classList.add("hidden");
};

document.getElementById("saveBtn").onclick=()=>{
const title=titleInput.value;
if(!title)return;

const file=fileInput.files[0];
const entry={
title,
expiry:expiryInput.value,
fileName:file?file.name:null,
created:Date.now()
};

db[currentPage].push(entry);
save();
modal.classList.add("hidden");
titleInput.value="";
expiryInput.value="";
fileInput.value="";
render(currentPage);
updateStats();
};

function deleteItem(page,i){
db[page].splice(i,1);
save();
render(page);
updateStats();
}

function render(page){
const container=document.getElementById(page);
if(!container)return;
container.innerHTML="";
db[page].forEach((item,i)=>{
const div=document.createElement("div");
div.className="item";
div.innerHTML=`
<div>
<strong>${item.title}</strong><br>
${item.expiry?`Expires: ${item.expiry}`:""}
${item.fileName?`<br>File: ${item.fileName}`:""}
</div>
<button onclick="deleteItem('${page}',${i})">
<i class="fa-solid fa-trash"></i>
</button>`;
container.appendChild(div);
});
}

function updateStats(){
docCount.innerText=db.documents.length;
subCount.innerText=db.subscriptions.length;
reminderCount.innerText=db.reminders.length;
}

updateStats();
Object.keys(db).forEach(render);
