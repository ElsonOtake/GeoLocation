<a name="readme-top"></a>

<!-- TABLE OF CONTENTS -->

# 📗 Table of Contents

- [📖 About the Project](#about-project)
  - [🛠 Built With](#built-with)
    - [Tech Stack](#tech-stack)
    - [Key Features](#key-features)
  - [🚀 Live Demo](#live-demo)
- [💻 Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Setup](#setup)
  - [Install](#install)
  - [Usage](#usage)
  - [Run tests](#run-tests)
- [👥 Author](#author)
- [🔭 Future Features](#future-features)
- [🤝 Contributing](#contributing)
- [⭐️ Show your support](#support)
- [🙏 Acknowledgements](#acknowledgements)
- [📝 License](#license)

<!-- PROJECT DESCRIPTION -->

# 📖 Geolocation <a name="about-project"></a>

**Geolocation** comprises a set of tests to better understand the use of maps. Geographic location and map display resources were explored using Google Maps and Mapbox.


## 🛠 Built With <a name="built-with"></a>

### Tech Stack <a name="tech-stack"></a>

<details>
  <summary>Client</summary>
  <ul>
    <li><a href="https://rubyonrails.org/">Ruby on Rails</a></li>
  </ul>
</details>

<details>
  <summary>Server</summary>
  <ul>
    <li><a href="https://bulma.io/">Bulma</a></li>
    <li><a href="https://github.com/alexreisner/geocoder">Geocoder</a></li>
    <li><a href="https://developers.google.com/api-client-library">Google Api Client</a></li>
    <li><a href="https://developers.google.com/maps/">Google Maps Service</a></li>
    <li><a href="https://github.com/ankane/mapkick">Mapkick</a></li>
    <li><a href="https://stimulus.hotwired.dev/">Stimulus</a></li>
  </ul>
</details>

<details>
<summary>Database</summary>
  <ul>
    <li><a href="https://www.postgresql.org/">PostgreSQL</a></li>
  </ul>
</details>

<!-- Features -->

### Key Features <a name="key-features"></a>

- **Google Maps**
- **Mapbox**

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LIVE DEMO -->

## 🚀 Live Demo <a name="live-demo"></a>

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## 💻 Getting Started <a name="getting-started"></a>

To get a local copy up and running, follow these steps.

### Prerequisites

In order to run this project you need:

[Ruby](https://www.ruby-lang.org/en/)

### Setup

Clone this repository to your desired folder:

using HTTPS:
```sh
  git clone https://github.com/ElsonOtake/Geolocation.git
  cd Geolocation
```

using an SSH key:
```sh
  git clone git@github.com:ElsonOtake/Geolocation.git
  cd Geolocation
```

using GitHub CLI:
```sh
  git clone gh repo clone ElsonOtake/Geolocation
  cd Geolocation
```

### Install

Fill in the environment variables
```sh
  DATABASE_USERNAME=postgres_username
  DATABASE_PASSWORD=postgres_password
  MAPBOX_ACCESS_TOKEN=mapbox_access_token
```
Fill in your `Google key` in the last line of the `app/javascript/src/google_maps.js` file

Install this project with:
```sh
  bundle install
  npm install
  rails db:create db:migrate db:seed
```

### Usage

To run the project, execute the following command:

```sh
  bin/dev
```
Open `http://localhost:3000/` on your browser.

### Run tests

To run tests, run the following command:

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- AUTHOR -->

## 👥 Author <a name="author"></a>

👤 **Elson Otake**

- GitHub: [elsonotake](https://github.com/elsonotake)
- Twitter: [@elsonotake](https://twitter.com/elsonotake)
- LinkedIn: [elsonotake](https://linkedin.com/in/elsonotake)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- FUTURE FEATURES -->

## 🔭 Future Features <a name="future-features"></a>

- [ ] **Deploy the live demo**

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->

## 🤝 Contributing <a name="contributing"></a>

Contributions, issues, and feature requests are welcome!

Feel free to check the [issues page](../../issues/).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- SUPPORT -->

## ⭐️ Show your support <a name="support"></a>

Give a ⭐️ if you like this project!

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ACKNOWLEDGEMENTS -->

## 🙏 Acknowledgments <a name="acknowledgements"></a>

I would like to thank:

- [Microverse](https://www.microverse.org/)
- [W3Schools](https://www.w3schools.com/)
- [Stack Overflow](https://stackoverflow.com/)
- [Mapbox](https://www.mapbox.com/)
- [Google Maps](https://developers.google.com/maps)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->

## 📝 License <a name="license"></a>

This project is [MIT](./MIT.md) licensed.

<p align="right">(<a href="#readme-top">back to top</a>)</p>
