

const messages = [

    {
        title: "🎉 Assignment Defeated!",
        msg: "Now close the laptop for 15 minutes. Your brain deserves workers' compensation."
    },

    {
        title: "🫡 Mission Complete!",
        msg: "Time to check the Hangout section. Touching grass is highly recommended."
    },

    {
        title: "📚 Study Session Completed",
        msg: "CampusFlow suggests: 🍔 Food • 🎬 Movie • 🚶 Walk • 😴 Power Nap"
    },

    {
        title: "🎓 Academic Weapon Activated",
        msg: "Reward unlocked: 1 guilt-free episode of your favorite show."
    },

    {
        title: "🔥 Assignment Submitted",
        msg: "You earned Peace of Mind, Lower Stress and Free Time."
    },

    {
        title: "☕ Productivity Achieved",
        msg: "CampusFlow prescribes coffee and friendship."
    },

    {
        title: "🌟 Great Work!",
        msg: "Go annoy your friends. You've earned it."
    }

];

function completeAssignment(index){

    const random =
        messages[Math.floor(Math.random() * messages.length)];

    document.getElementById("popup-title").innerText =
        random.title;

    document.getElementById("popup-message").innerText =
        random.msg;

    document.getElementById("successPopup").style.display =
        "flex";

    setTimeout(() => {
        window.location.href = "/complete/" + index;
    }, 2000);
}

function closePopup(){
    document.getElementById("successPopup").style.display =
        "none";
}

