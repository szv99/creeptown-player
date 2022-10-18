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
	console.log(uid)
	let response = await postJson("/local_data", {"uid": uid})
	console.log(response)
	document.getElementById("mail").textContent = response.email;
}