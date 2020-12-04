export default function () {
    const layout = new DocumentFragment();

    const settingsForm = document.createElement('div');
    settingsForm.innerHTML = `
        <span>Select background color</span>
        <input type="color" id="color" value="#ffffff">
    `;
    layout.appendChild(settingsForm);

    layout.getElementById('color').addEventListener('change', () => {
        const colorEl = <HTMLInputElement>document.getElementById('color');
        const color: string = colorEl.value;
        document.body.style.backgroundColor = color;
    });

    return layout;
};
