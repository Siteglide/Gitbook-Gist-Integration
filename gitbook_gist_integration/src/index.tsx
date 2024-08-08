import {
    createIntegration,
    FetchPublishScriptEventCallback,
    RuntimeContext,
    RuntimeEnvironment,
} from '@gitbook/runtime';

import script from './script.raw.js';

type GistRuntimeContext = RuntimeContext<
    RuntimeEnvironment<
        {},
        {
            gist_key?: string;
        }
    >
>;

export const handleFetchEvent: FetchPublishScriptEventCallback = async (
    event,
    { environment }: GistRuntimeContext
) => {
    const gistId =
        environment.spaceInstallation?.configuration?.gist_key ??
        environment.siteInstallation?.configuration?.gist_key ??
        'Gist Key not configured';

    if (!gistId) {
        return;
    }

    return new Response(script.replace('<TO_REPLACE>', gistId), {
        headers: {
            'Content-Type': 'application/javascript',
            'Cache-Control': 'max-age=604800',
        },
    });
};

export default createIntegration<GistRuntimeContext>({
    fetch_published_script: handleFetchEvent,
});