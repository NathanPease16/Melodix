(async () => {
    const res = await fetch('/me');

    if (res.ok) {
        console.log(await res.json());
    }
})();