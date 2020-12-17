const botChannelNameInput = document.querySelector('input#botChannelName');
const botNameInput = document.querySelector('input#botName');
const botOAuthPasswordInput = document.querySelector('input#botOAuthPassword');
const loginButton = document.querySelector('button#login');

let channelName = window.localStorage.getItem('botChannelName') || '';
let botName = window.localStorage.getItem('botName') || '';
let botOAuthPassword = window.localStorage.getItem('botOAuthPassword') || '';

botChannelNameInput.value = channelName;
botNameInput.value = botName;
botOAuthPasswordInput.value = botOAuthPassword;

const setLoginButtonState = () => {
  loginButton.disabled = !(
    channelName.length > 0 &&
    botName.length > 0 &&
    botOAuthPassword.length > 0
  );
};

botChannelNameInput.addEventListener('input', (e) => {
  e.stopPropagation();
  window.localStorage.setItem('botChannelName', e.target.value);
  channelName = e.target.value;
  setLoginButtonState();
});

botNameInput.addEventListener('input', (e) => {
  e.stopPropagation();
  window.localStorage.setItem('botName', e.target.value);
  botName = e.target.value;
  setLoginButtonState();
});

botOAuthPasswordInput.addEventListener('input', (e) => {
  e.stopPropagation();
  window.localStorage.setItem('botOAuthPassword', e.target.value);
  botOAuthPassword = e.target.value;
  setLoginButtonState();
});

loginButton.addEventListener('click', () => {
  if (
    channelName.length > 0 &&
    botName.length > 0 &&
    botOAuthPassword.length > 0
  ) {
    window.location = '/authorize';
  }
});

setLoginButtonState();
