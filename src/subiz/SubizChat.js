import { useEffect } from 'react';

const SubizChat = () => {
  useEffect(() => {
    // Kiểm tra xem script Subiz đã được nhúng vào chưa
    const existingScript = document.querySelector('script[src*="sbz/app.js"]');
    
    if (!existingScript && typeof window !== 'undefined') {
      // Tạo và thêm script Subiz vào trang
      const script = document.createElement('script');
      script.innerHTML = `!function(s,u,b,i,z){
        var o,t,r,y;
        s[i]||(s._sbzaccid=z,s[i]=function(){s[i].q.push(arguments)},s[i].q=[],s[i]("setAccount",z),
        r=["widget.subiz.net","storage.googleapis"+(t=".com"),"app.sbz.workers.dev",i+"a"+
        (o=function(k,t){var n=t<=6?5:o(k,t-1)+o(k,t-3);return k!==t?n:n.toString(32)})(20,20)+t,
        i+"b"+o(30,30)+t,i+"c"+o(40,40)+t],(y=function(k){
          var t,n;
          s._subiz_init_2094850928430||r[k]&&(t=u.createElement(b),n=u.getElementsByTagName(b)[0],
          t.async=1,t.src="https://"+r[k]+"/sbz/app.js?accid="+z,n.parentNode.insertBefore(t,n),
          setTimeout(y,2e3,k+1))})(0))}(window,document,"script","subiz","acsdzucyfyshkppajwex");`;

      // Đảm bảo script tải không đồng bộ
      script.async = true;

      // Thêm script vào body của document
      document.body.appendChild(script);

      // Kiểm tra khi script đã tải xong
      script.onload = () => {
        //console.log("Subiz initialized: ", window.subiz);
        if (window.subiz) {
          window.subiz("show"); // Mở cửa sổ chat khi script đã tải
        } else {
          console.error("Subiz did not initialize correctly.");
        }
      };

      script.onerror = () => {
        console.error("Error loading Subiz script.");
      };
    }

    return () => {
      // Dọn dẹp khi component bị hủy
      const scriptToRemove = document.querySelector('script[src*="sbz/app.js"]');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, []);

  return null;
};

export default SubizChat;
