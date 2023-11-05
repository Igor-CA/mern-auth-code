# MERN authentication/Autenticação de usupario com MERN

## EN
### Description:
This repository hosts a simple user authentication website developed using the MERN stack (MongoDB, Express.js, React, and Node.js) and styled with Tailwind CSS. The project consists of a React page that uses React Router to handle client-side navigation and connects to a simple API for data manipulation.

### Key Features:

* **User Authentication:** Visitors can create an account, log in, and, if necessary, reset their passwords.
* **Secure Password Reset:** Users have the option to securely reset their passwords by receiving a reset link at their registered email address.
* **User-Friendly Navigation:** Site navigation is efficiently managed through React Router, providing a smooth user experience.
* **Styling with Tailwind CSS:** The site has been styled using Tailwind CSS, a highly customizable and user-friendly CSS utility library.
* **Data Validation and Security:**
  * **Express Validator:** We use the express-validator library to perform data validation on the server-side, ensuring that all user inputs are checked and handled appropriately to prevent common attacks such as SQL injection and XSS (Cross-Site Scripting).
  * **Bcrypt for Password Encryption:** We've implemented bcrypt to ensure the security of user passwords. This module is used to encrypt and apply salt to passwords before storing them in the database, making it extremely difficult to recover original passwords, even in the event of a data breach.
  * **Client-Side Data Validation:**
    In addition to server-side data validation with express-validator, we've implemented additional client-side validations to provide a more responsive and user-friendly experience. We use data validation techniques in React to ensure that user-entered information is valid even before it is sent to the server. This helps prevent errors and provides immediate feedback to users, making interactions with the site smoother and more effective.

### Technologies Used:
* **MongoDB:** A NoSQL database used to store user information.
* **Express.js:** A Node.js application framework for building the API and handling requests.
* **React:** A JavaScript library for creating the user interface.
* **Tailwind CSS:** A utility-first CSS library for simplified styling.
* **Node.js:** A JavaScript runtime environment on the server-side.

### Usage Instructions:

1. Clone this repository to your local machine.
2. Install server and client dependencies by running `npm install` separately in the server and client folders.
```sh
npm install
```
3. Configure the .env file with your environment variables, including MongoDB database information and email settings. The repository includes a .envExample file demonstrating how the .env file should be filled out.
4. Start the server with npm start in the server folder and the client in the client folder (both separately).
```sh
npm start
```
5. Access http://localhost:3000 in your web browser and start exploring.
### Acknowledgments:
This project was inspired by the following tutorial: https://github.com/woodburydev/passport-local-video. <b/r>
Form validation on the server side was based on the MDN tutorial: https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/Tutorial_local_library_website.
## PT-BR
### Descrição:
Este repositório abriga um site simples de autenticação de usuário desenvolvido com a stack MERN (MongoDB, Express.js, React e Node.js) e estilizado usando o Tailwind CSS. O projeto consiste em uma página React que utiliza o React Router para facilitar a navegação no lado do cliente e se conecta a uma API simples para a manipulação de dados.

### Recursos Principais:

* **Autenticação de Usuário:** Os visitantes podem criar uma conta, fazer login e, se necessário, redefinir suas senhas.
* **Redefinição de Senha Segura:** Os usuários têm a opção de redefinir suas senhas com segurança, recebendo um link de redefinição em seu endereço de e-mail registrado.
* **Navegação Amigável:** A navegação pelo site é gerenciada eficientemente por meio do React Router, proporcionando uma experiência de usuário suave.
Estilização com Tailwind CSS: O site foi estilizado usando o Tailwind CSS, uma biblioteca de utilitários CSS altamente personalizável e fácil de usar.
* **Segurança e Validação de Dados:**
  * **Express Validator:** Utilizamos a biblioteca express-validator para realizar a validação de dados no lado do servidor, garantindo que todas as entradas do usuário sejam verificadas e tratadas adequadamente para prevenir ataques comuns, como injeção de SQL e XSS (Cross-Site Scripting).
  * **Bcrypt para Criptografia de Senhas:** Implementamos o bcrypt para garantir a segurança das senhas dos usuários. Este módulo é usado para criptografar e aplicar salt às senhas antes de armazená-las no banco de dados, tornando extremamente difícil a recuperação das senhas originais, mesmo em caso de violação de dados.
  * **Validação de Dados do Lado do Cliente:**
Além das validações de dados realizadas no lado do servidor com express-validator, implementamos validações adicionais no lado do cliente para proporcionar uma experiência de usuário mais responsiva e amigável. Utilizamos técnicas de validação de dados no React para garantir que as informações inseridas pelos usuários sejam válidas antes mesmo de serem enviadas para o servidor. Isso ajuda a evitar erros e fornece feedback imediato aos usuários, tornando a interação com o site mais suave e eficaz.
### Tecnologias Utilizadas:
* **MongoDB:** Banco de dados NoSQL utilizado para armazenar informações do usuário.
* **Express.js:** Framework de aplicativo Node.js para construir a API e manipular solicitações.
* **React:** Biblioteca JavaScript para criar a interface do usuário.
* **Tailwind CSS:** Biblioteca de utilitários CSS para estilização simplificada.
* **Node.js:** Ambiente de tempo de execução JavaScript do lado do servidor.

### Instruções de Uso:

1. Clone este repositório em sua máquina local.
2. Instale as dependências do servidor e do cliente executando npm install na nas pastas server e client (separadamente).
```sh
npm install
```
3. Configure o arquivo .env com suas variáveis de ambiente, incluindo as informações do banco de dados MongoDB e configurações de e-mail. O repositório possui um arquivo .envExemple mostrando como o .env deve ser preenchido.
4. Inicie o servidor com npm start na pasta server e o cliente na past client (ambos separadamente).
```sh
npm start
```
5. Acesse [http://localhost:3000](http://localhost:3000) em seu navegador e comece a explorar.

### Agradecimentos:
Esse projeto teve sua base inspirado no seguinte tutorial https://github.com/woodburydev/passport-local-video </br>
As validações de formulário por parte do servidor teve como base o tutorial da MDN: https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/Tutorial_local_library_website
