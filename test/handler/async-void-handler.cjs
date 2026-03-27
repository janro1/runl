exports.handler = async (one, two) => {
    console.log("hello world");

    await new Promise(resolve => setTimeout(resolve, 42));

    return;
}

