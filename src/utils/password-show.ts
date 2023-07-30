

export const togglePasswordView = () => {
  const p: HTMLInputElement = document.getElementById("password");
  const i: HTMLImageElement = document.getElementById('password-icon');
  if (p.type === "password") {
    p.type = "text";
    i.src = "../../hide-64.png";
  }
  else {
    p.type = "password";
    i.src = "../../eye-64.png";
  }
};

