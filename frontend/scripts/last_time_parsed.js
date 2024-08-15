/*----------------------------------------------------------------------------
 *  © 2024 Solyanik Egor   <yokhor06@mail.ru>
 *
 *  This code is part of Vkadre project, a service for finding film shows.
 *  It is licensed under the AGPL-3.0,
 *  you may not use this file except in compliance with the license.
 *  
 *  License text: https://www.gnu.org/licenses/agpl-3.0.en.html
 *  About project: https://github.com/yokhorr/yokhorr.github.io
 *  SPDX-License-Identifier: AGPL-3.0
----------------------------------------------------------------------------*/


// insert time of last parser run
fetch("../backend/data/last_time_parsed.txt")
    .then((response) => response.text())
    .then((data) => {
        document.getElementById("last-time-parsed").innerHTML = data;
    });
