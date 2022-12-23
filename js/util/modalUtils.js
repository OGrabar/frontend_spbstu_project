export const toggleModal = (modalId) => {
    $(modalId).modal('toggle');
}

export const showModal = (modalId) => {
    $(modalId).modal({backdrop: 'static', keyboard: false});
}