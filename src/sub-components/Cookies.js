export const Set_cookies = (data,mins=150) => {
  const d = new Date();
  data['expiry']=d.getTime() + (mins*60*1000);
  localStorage.setItem('solution', JSON.stringify(data))
}


export const Get_cookies = (key='solution') => {
const itemStr = localStorage.getItem(key)
if (!itemStr) {
  return null;
}else{
  const item = JSON.parse(itemStr)
  const now = new Date()
  if (now.getTime() > item.expiry) {
    localStorage.removeItem(key)
    return null;
  }
  return item
}
}