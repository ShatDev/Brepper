

const ethereumButton = document.querySelector('.connect-button');

ethereumButton.addEventListener('click', () => {
  ethereum.request({ method: 'eth_requestAccounts' });
});

