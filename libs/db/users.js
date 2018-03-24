const USERS = {
    'andreymedvedev': 'Андрей',
    'eltyy': 'Артем',
    'ms_mix_up': 'Ульяна',
};

module.exports = {
    getName: username => USERS[username],
};
