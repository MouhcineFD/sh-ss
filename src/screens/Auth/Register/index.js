import TextField from "@material-ui/core/TextField";
import { Button, message } from "antd";
import React from "react";
import { useRequest } from "../../../shared/useRequest";
import {
  checkEmailValidation,
  checkPasswordValidation,
} from "./../../../utils/helpers";
import "./style.css";

export default ({ history }) => {
  const [values, setValues] = React.useState({
    username: "",
    email: "",
    password: "",
    passwordConfirmation: "",
  });
  const [errors, setErrors] = React.useState({
    username: false,
    email: false,
    password: false,
    passwordConfirmation: false,
  });

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  const onSubmitSucceed = () => {
    message.success("Vous avez crée votre compte avec succès ");
    history.push("/login");
  };

  const onSubmitFailed = () => {
    message.error("Erreur de creation de compte");
  };

  const request = useRequest({
    lazy: true,
    method: "POST",
    url: `/api/auth/signup`,
    alias: {
      singup: [
        { in: "username", out: "data.username" },
        { in: "password", out: "data.password" },
        { in: "email", out: "data.email" },
        { in: "roles", out: "data.roles" },
      ],
    },
    onData: onSubmitSucceed,
    onError: onSubmitFailed,
  });

  const requestIsInProgress = request.loading;

  const handleSubmit = () => {
    const { password, passwordConfirmation, username, email } = {
      ...values,
    };
    const passwordError = checkPasswordValidation(password);
    const passwordConfirmationError = passwordConfirmation !== password;
    const emailError = checkEmailValidation(email);
    const usernameError = !username;

    setErrors({
      username: usernameError,
      email: emailError,
      password: passwordError,
      passwordConfirmation: passwordConfirmationError,
    });

    if (
      !usernameError &&
      !passwordError &&
      !passwordConfirmationError &&
      !emailError
    )
      request.alias.singup({
        username: values.username,
        password: values.password,
        email: values.email,
        roles: ["user"],
      });
  };

  return (
    <div>
      <p className="text-1">Veuillez vous connecter à votre compte.</p>
      <TextField
        label="Username"
        className="text-field"
        margin="normal"
        onChange={handleChange("username")}
        error={errors.username}
        helperText={
          errors.username ? "Merci de taper votre identifiant valide !" : " "
        }
      />
      <TextField
        label="Email"
        className="text-field"
        margin="normal"
        onChange={handleChange("email")}
        error={errors.email}
        helperText={
          errors.email ? "Merci de taper votre identifiant mail valide !" : " "
        }
      />
      <TextField
        label="Mot de passe"
        className="text-field"
        type="password"
        margin="normal"
        onChange={handleChange("password")}
        error={errors.password}
        helperText={
          errors.password ? "Merci de taper un mot de pass valide !" : " "
        }
      />
      <TextField
        label="Mot de passe de confirmation"
        className="text-field"
        type="password"
        margin="normal"
        onChange={handleChange("passwordConfirmation")}
        error={errors.passwordConfirmation}
        helperText={
          errors.passwordConfirmation
            ? "Merci de taper le mot de pass de confirmation valide !"
            : " "
        }
      />
      <div className="content-1">
        <Button
          type="primary"
          shape="round"
          size="large"
          className="button"
          onClick={handleSubmit}
          loading={requestIsInProgress}
        >
          Enregistrer
        </Button>
      </div>
    </div>
  );
};
