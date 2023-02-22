
export function ServerObj(url, date) {
  this.url = url;
  this.ServerDate = date;
}

export function GetServerDate(url){
  return new Promise(function(resolve, reject){
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.onreadystatechange = function() {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        const headers = xhr.getAllResponseHeaders(); // 응답 헤더 정보 가져오기
        const headers_arr = headers.split(/\r?\n/); //\n del로 split
        const headers_obj = {};
        
        headers_arr.forEach(str => {
          const [key,value] = str.split(/:(.+)/, 2).map(str=>str.trim());
          headers_obj[key] = value;
        });
        const CalledServerDate = new Date(headers_obj.date);
        console.log('호출된 Date : ',CalledServerDate.toLocaleString());
        
        resolve(CalledServerDate);
      }
    }
    xhr.send();
  })
}