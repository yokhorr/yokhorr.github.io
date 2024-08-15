# © 2024 Solyanik Egor   <yokhor06@mail.ru>
#
# This code is part of Vkadre project, a service for finding film shows.
# It is licensed under the AGPL-3.0,
# you may not use this file except in compliance with the license.
#
# License text: https://www.gnu.org/licenses/agpl-3.0.en.html
# About project: https://github.com/yokhorr/yokhorr.github.io
# SPDX-License-Identifier: AGPL-3.0


# 1 апреля -> 01.04
def strict_date_format(text: str) -> str:
    text = text.split()
    day = text[0]
    month = text[1]
    if len(day) == 1:
        day = '0' + day
    months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля',
              'августа', 'сентября', 'октября', 'ноября', 'декабря']
    month = str(months.index(month) + 1)
    if len(month) == 1:
        month = '0' + month
    return day + '.' + month


# separate the day of the week and delete extra whitespaces
def get_clear_text(text: str) -> tuple[str, str]:
    text = text.strip()
    days_of_week = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье']
    found_day = None
    for day in days_of_week:
        rubbish = str(day + ', ')
        if rubbish in text:
            text = text.removeprefix(rubbish)
            found_day = day
            break
    return text, found_day
