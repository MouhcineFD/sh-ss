import TextField from "@material-ui/core/TextField";
import { Button, Checkbox, message } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import { Current } from "../../../shared/contexts/current";
import { useRequest } from "../../../shared/useRequest";
import { PATHS } from "./../../../utils/constants";
import { checkPasswordValidation } from "./../../../utils/helpers";
import "./style.css";

const styles = {
  bodyText: {
    fontFamily: "Source Sans Pro",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: "15px",
    lineHeight: "19px",
    color: "#43425D",
  },
};

const Login = ({ history, ...props }) => {
  const onSubmitSucceed = (response) => {
    props.current.setUser({
      isLoggedIn: true,
      authorization: response.accessToken,
      id: response.id,
      status: "Active",
      isAdmin: response.isAdmin,
    });
    history.push(PATHS.DASHBOARD);
  };

  const onSubmitFailed = (error) => {
    message.error("Erreur d'authentification");
  };
  const request = useRequest({
    lazy: true,
    method: "POST",
    url: `/api/auth/signin`,
    alias: {
      login: [
        { in: "username", out: "data.username" },
        { in: "password", out: "data.password" },
      ],
    },
    onData: onSubmitSucceed,
    onError: onSubmitFailed,
  });
  const { requestIsInProgress } = request.loading;
  const [values, setValues] = React.useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = React.useState({
    username: false,
    password: false,
  });

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  const handleSubmit = () => {
    const { username, password } = { ...values };
    const usernameError = !username;
    const passwordError = checkPasswordValidation(password);

    setErrors({
      username: usernameError,
      password: passwordError,
    });

    if (!usernameError && !passwordError) {
      request.alias.login({
        username: values.username.toLowerCase(),
        password: values.password,
      });
    }
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
          errors.username
            ? "Merci de taper votre identifiant mail valide !"
            : " "
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
          errors.password ? "Merci de taper votre mot de pass valide !" : " "
        }
      />
      <div className="content-1">
        <Checkbox style={styles.bodyText}>Se souvenir de moi</Checkbox>
        <Link style={styles.bodyText} to="/register">
          Créer un compte ?
        </Link>
      </div>
      <Button
        type="primary"
        shape="round"
        size="large"
        className="button"
        onClick={handleSubmit}
        loading={requestIsInProgress}
      >
        Connexion
      </Button>
    </div>
  );
};

export default Current(Login);
