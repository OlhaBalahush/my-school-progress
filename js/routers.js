import { generateLogin } from "./pages/login.js"
import { fetchMainPageContent } from "./pages/main.js"

export const navigateTo = url => {
    history.pushState(null, null, url)
    router()
}

export const router = async () => {
    const routes = [
        {
            path: "/",
            view: fetchMainPageContent // TODO change to fetch
        },
        {
            path: "/login",
            view: generateLogin
        }
    ]
    const urlParts = location.pathname.split("/");
    const potentialMatches = routes.map(route => {
        const routeParts = route.path.split("/");
        const isMatch = routeParts.length === urlParts.length && routeParts.every((part, index) => {
            return part === urlParts[index] || part.startsWith(":");
        });

        return {
            route: route,
            isMatch: isMatch,
            params: isMatch ? urlParts.slice(routeParts.length - 1) : []
        };
    });

    let match = potentialMatches.find(potentialMatch => potentialMatch.isMatch);

    if (!match) {
        match = {
            route: routes[0],
            isMatch: true
        };
    }
    // Check if match.params exists and has at least one element
    const param = match.params && match.params.length > 0 ? match.params[0] : null;

    match.route.view(param)
}