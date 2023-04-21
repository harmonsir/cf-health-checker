addEventListener("scheduled", (event) => {
    event.waitUntil(handleFetch(event));
});

addEventListener('fetch', event => {
    event.respondWith(handleFetch(event));
});

const HostsCacheKey = "HealthCheckerHosts";
const CacheKey = "HealthChecker";
const newRequestInit = {
    method: "GET",
    headers: {
        "content-type": "text/html;charset=UTF-8",
        "user-agent": "cf_worker health_check v0.1"
    },
};

async function gatherResponse(response) {
    return response.status < 300;
}

async function handleFetch(event) {
    if (event.type === "fetch") {
        const content = await KV_MIDDLEWARE.get(CacheKey);
        if (content) {
            return new Response(content)
        }
    }
    const Hosts = await KV_MIDDLEWARE.get(HostsCacheKey, {type: "json"});
    let result = {}
    for (let key in Hosts) {
        let r = new Request(Hosts[key], newRequestInit);
        result[key] = await gatherResponse(await fetch(r));
        // result += key + " -> " + await gatherResponse(r) + "\n"
    }

    const content = JSON.stringify({
        "APP": "HealthChecker",
        "TS": new Date().toLocaleString("zh-Hans-CN", {timeZone: "Asia/Shanghai"}),
        result
    })
    await KV_MIDDLEWARE.put(CacheKey, content);
    return new Response(content)
}
