export default {
    async fetch(request, env) {
        const Hosts = {
          
        };

        async function gatherResponse(response) {
            return response.status < 300;
        }

        const init = {
            headers: {
                "content-type": "text/html;charset=UTF-8",
                "user-agent": "cf_worker health_check v0.1"
            },
        };

        let result = ""
        for (let key in Hosts) {
            let r = await fetch(Hosts[key], init);
            result += key + " -> " + await gatherResponse(r) + "\n"
        }
        return new Response("Health Checks: \n\n" + result)
    }
}
