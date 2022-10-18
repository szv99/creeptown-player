async function postJson(url, data={})
{
	return new Promise(function (resolve, reject)
	{
		const XHR = new XMLHttpRequest()
		
		XHR.addEventListener("load", event =>
		{
			try
			{
				var obj = JSON.parse(event.target.responseText)
				resolve(obj)
			}catch(e)
			{
				alert(event.target.responseText)
				reject()
				return
			}
		});
	
		XHR.addEventListener("error", event =>
		{
			alert("Oops! Something went wrong.")
			reject()
		});
		
	    XHR.open("POST", url)
		XHR.setRequestHeader("Content-Type", "application/json");
	    XHR.send(JSON.stringify(data))
	})
}

async function localAccountData(){
	let uid = document.getElementById("siema").value;
	let nickname = localStorage.getItem('username')
	console.log(uid)
	let response = await postJson("/local_data", {"uid": uid, "nickname": nickname})
	console.log(response)
}

async function skipSong(){
	console.log('enio')
	let nickname = localStorage.getItem('username')
	let response = await postJson("/vote_skip", {"nickname": nickname})
	console.log(response)
}