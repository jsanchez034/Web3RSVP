import { ApolloClient, InMemoryCache, makeVar } from "@apollo/client";


export default new ApolloClient({
  uri: "https://api.thegraph.com/subgraphs/name/jsanchez034/web3-rsvp",
  cache: new InMemoryCache(),
});


const intialThemeVar = 'light';

export const themeVar = makeVar(intialThemeVar);
