
const socket = io('http://localhost:9000');
let nsSocket = "";

socket.on('nsList', (nsData) => {
    document.querySelector('.namespaces').innerHTML="";
    nsData.forEach((namespace) => {
        const imgDiv = document.createElement('div');
        imgDiv.classList.add('namespace');

        const img =  document.createElement('img');
        img.src = namespace.img;
        img.atl =  namespace.endpoint;

        imgDiv.appendChild(img);
        document.querySelector('.namespaces').appendChild(imgDiv);
            imgDiv.addEventListener('click', ()=>{
                joinNs(namespace.endpoint);
            })
    })

   
})

