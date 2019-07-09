export function apiPoint(x) {

  return setTimeout(() => {
    fetch("http://183.88.219.85:7078/appoint/point.php", {
      method: "POST",
      body: JSON.stringify({
        a: x
      })
    })
    .then(res => res.json())
    .then(res => {
      return res
    })
  }, 1000)


}

