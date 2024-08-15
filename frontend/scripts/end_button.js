/*----------------------------------------------------------------------------
 *  © 2024 Malyshev Nikita <nikita.malyshev0007@gmail.com>
 *
 *  This code is part of Vkadre project, a service for finding film shows.
 *  It is licensed under the AGPL-3.0,
 *  you may not use this file except in compliance with the license.
 *  
 *  License text: https://www.gnu.org/licenses/agpl-3.0.en.html
 *  About project: https://github.com/yokhorr/yokhorr.github.io
 *  SPDX-License-Identifier: AGPL-3.0
----------------------------------------------------------------------------*/


function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: "smooth", // Добавьте плавную прокрутку
    });
}

const endButton = document.querySelector(".btn");
endButton.addEventListener("click", scrollToTop);
