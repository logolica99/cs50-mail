document.addEventListener('DOMContentLoaded', function() {
  
  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  document.querySelector('#compose-form').addEventListener('submit',send_email);
  

  // By default, load the inbox
  load_mailbox('inbox');

  
  
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';

  
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  if(mailbox==='sent'){
  
      fetch('/emails/sent')
    .then(response => response.json())
    .then(emails => {

      const mails = document.createElement('div');
      mails.classList.add('all')
      
      for(i=0;i<emails.length;i++){
        
        li = document.createElement('div');
        li.classList.add("element");
        let mail_elem = ''
        mail_elem=`<p class='to'>${emails[i]['recipients']}</p> <p class='subject'>${emails[i]['subject']}</p> <p class='time'>${emails[i]['timestamp']}</p`
        //mail_elem+='<h6>To:</h6 >'+'<p>'+emails[i]['recipients'][0]+'</p>'+ '<h6>Subject:</h6><p>'+emails[i]['subject']+'</p><h6> Sent: '+emails[i]['timestamp']+'</h6>';
        
        li.innerHTML+=mail_elem;
        li.classList.add('read')
        li.dataset.id=emails[i]['id'];
       
        mails.appendChild(li);
       
      }
      document.querySelector('#emails-view').appendChild(mails);
      document.querySelectorAll('.element').forEach( mail=>{
        mail.addEventListener('click',()=>view_a_mail(mail.dataset.id,'sent'))}
      )

      


    });
  }
  if(mailbox==='inbox'){
   
    fetch('/emails/inbox')
    .then(response => response.json())
    .then(emails => {

      const mails = document.createElement('div');
      mails.classList.add('all')
      
      for(i=0;i<emails.length;i++){
        
        li = document.createElement('div');
        li.classList.add("element");
        let mail_elem = ''
        
        //mail_elem+='<h6>From:</h6 >'+'<p>'+emails[i]['sender']+'</p>'+ '<h6>Subject:</h6><p>'+emails[i]['subject']+'</p><h6> Sent: '+emails[i]['timestamp']+'</h6>';
        mail_elem=`<p class='to'>${emails[i]['recipients']}</p> <p class='subject'>${emails[i]['subject']}</p> <p class='time'>${emails[i]['timestamp']}</p`
        li.innerHTML+=mail_elem;
        

        if(emails[i]['read']===false){
          li.classList.add('unread')
        }else{
          li.classList.remove('unread')
          li.classList.add('read')
        }
        li.dataset.id=emails[i]['id'];
     
        
        
        mails.appendChild(li);
        

      }
      document.querySelector('#emails-view').appendChild(mails);
      document.querySelectorAll('.element').forEach( mail=>{
        mail.addEventListener('click',()=>view_a_mail(mail.dataset.id,''))}
      )
      
      
      
      


    });
  }
  if(mailbox==='archive'){
    fetch('/emails/archive')
    .then(response => response.json())
    .then(emails => {

      const mails = document.createElement('div');
      mails.classList.add('all')
      
      for(i=0;i<emails.length;i++){
        
        li = document.createElement('div');
        li.classList.add("element");
        let mail_elem = ''
       //mail_elem=`<p>${emails[i]['recipients']}</p> <p>${emails[i]['subject']}</p> <p>${emails[i]['timestamp']}</p`
        //mail_elem+='<h6>To:</h6 >'+'<p>'+emails[i]['recipients'][0]+'</p>'+ '<h6>Subject:</h6><p>'+emails[i]['subject']+'</p><h6> Sent: '+emails[i]['timestamp']+'</h6>';
        mail_elem=`<p class='to'>${emails[i]['recipients']}</p> <p class='subject'>${emails[i]['subject']}</p> <p class='time'>${emails[i]['timestamp']}</p`
        li.innerHTML+=mail_elem;
        li.classList.add('read')
        li.dataset.id=emails[i]['id'];
       
        mails.appendChild(li);
       
      }
      document.querySelector('#emails-view').appendChild(mails);
      document.querySelectorAll('.element').forEach( mail=>{
        mail.addEventListener('click',()=>view_a_mail(mail.dataset.id,''))}
      )

      


    });
  }
  
  

}

function send_email(event){
  event.preventDefault()
  recipients = document.querySelector("#compose-recipients").value;
        subject = document.querySelector("#compose-subject").value;
        body = document.querySelector("#compose-body").value;
        if (recipients.length == 0) return;
  
        fetch("/emails", {
          method: "POST",
          body: JSON.stringify({
            recipients: recipients,
            subject: subject,
            body: body
          }),
        })
          .then((response) => response.json())
          .then((result) => {
            console.log(result);
            load_mailbox('sent');

          });
}

function view_a_mail(id,message){
  console.log(id)
  fetch(`/emails/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
        read: true
    })
  })
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  
  fetch(`/emails/${id}`)
  .then(response=>response.json())
  .then(emails=>{
      archive_btn = `<button id="archive-btn" class='btn btn-sm btn-outline-primary'><svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-archive-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M12.643 15C13.979 15 15 13.845 15 12.5V5H1v7.5C1 13.845 2.021 15 3.357 15h9.286zM5.5 7a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zM.8 1a.8.8 0 0 0-.8.8V3a.8.8 0 0 0 .8.8h14.4A.8.8 0 0 0 16 3V1.8a.8.8 0 0 0-.8-.8H.8z"/></svg> Archive</button>`
      unarchive_btn = `<button id="unarchive-btn" class='btn btn-sm btn-outline-primary'><svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-archive-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M12.643 15C13.979 15 15 13.845 15 12.5V5H1v7.5C1 13.845 2.021 15 3.357 15h9.286zM5.5 7a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zM.8 1a.8.8 0 0 0-.8.8V3a.8.8 0 0 0 .8.8h14.4A.8.8 0 0 0 16 3V1.8a.8.8 0 0 0-.8-.8H.8z"/></svg> Unarchive</button>`
    if(message==='sent'){
      elem =  `<p><b>From: </b>${emails['sender']}</p>`+`<p><b>To: </b>${emails['recipients']}</p>`+`<p><b>Subject: </b>${emails['subject']}</p>`+`<p><b>Timestamp: </b>${emails['timestamp']}</p><button id='reply-btn' class='btn btn-sm btn-outline-primary'><svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-reply-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M9.079 11.9l4.568-3.281a.719.719 0 0 0 0-1.238L9.079 4.1A.716.716 0 0 0 8 4.719V6c-1.5 0-6 0-7 8 2.5-4.5 7-4 7-4v1.281c0 .56.606.898 1.079.62z"/></svg>  Reply</button><hr><p>${emails['body']}</p>`
      document.querySelector('#emails-view').innerHTML = elem;
    }else{
      if(emails['archived']==false){
      elem =  `<p><b>From: </b>${emails['sender']}</p>`+`<p><b>To: </b>${emails['recipients']}</p>`+`<p><b>Subject: </b>${emails['subject']}</p>`+`<p><b>Timestamp: </b>${emails['timestamp']}</p>${archive_btn}<button id='reply-btn' class='btn btn-sm btn-outline-primary'><svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-reply-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M9.079 11.9l4.568-3.281a.719.719 0 0 0 0-1.238L9.079 4.1A.716.716 0 0 0 8 4.719V6c-1.5 0-6 0-7 8 2.5-4.5 7-4 7-4v1.281c0 .56.606.898 1.079.62z"/></svg>  Reply</button><hr><p>${emails['body']}</p>`
    }else{
      elem =  `<p><b>From: </b>${emails['sender']}</p>`+`<p><b>To: </b>${emails['recipients']}</p>`+`<p><b>Subject: </b>${emails['subject']}</p>`+`<p><b>Timestamp: </b>${emails['timestamp']}</p>${unarchive_btn}<button id='reply-btn' class='btn btn-sm btn-outline-primary'><svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-reply-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M9.079 11.9l4.568-3.281a.719.719 0 0 0 0-1.238L9.079 4.1A.716.716 0 0 0 8 4.719V6c-1.5 0-6 0-7 8 2.5-4.5 7-4 7-4v1.281c0 .56.606.898 1.079.62z"/></svg>  Reply</button><hr><p>${emails['body']}</p>`
    }  
    document.querySelector('#emails-view').innerHTML = elem;
    if(emails['archived']==false){
    document.querySelector('#archive-btn').addEventListener('click',()=>{
      fetch(`/emails/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
            archived:true
        })
      })
      load_mailbox('inbox');
    })
    }else{

    document.querySelector('#unarchive-btn').addEventListener('click',()=>{
      fetch(`/emails/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
            archived:false
        })
      })
      load_mailbox('inbox');
    })
    }}

    document.querySelector('#reply-btn').addEventListener('click',()=>{
      document.querySelector('#emails-view').style.display = 'none';
      document.querySelector('#compose-view').style.display = 'block';
    
      // Clear out composition fields
      document.querySelector('#compose-recipients').value = emails['recipients'];
      document.querySelector('#compose-subject').value = `Re:${emails['subject']}`;
      document.querySelector('#compose-body').value = `On ${emails['timestamp']}  ${emails['sender']} wrote: ${emails['body']}\n`;
    
    })
    
  })
  
  
}