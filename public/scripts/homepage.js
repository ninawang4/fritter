



function homePage(fields) {
    fetch('/api/homepage')
      .then(showResponse)
      .catch(showResponse);
  }
  