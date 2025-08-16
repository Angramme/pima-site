<script lang='ts'>
    import { enhance } from '$app/forms';
    import Markdown from '$lib/components/Markdown.svelte';
    import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";
    import { Badge } from "$lib/components/ui/badge";
    import { UserIcon, Mail, GraduationCap, Globe, Award, Briefcase, Calendar } from "@lucide/svelte";

    
    let { data, form } = $props();
    let profile = $derived(data.subject);

    let user_input: string | undefined = $state("user login");
</script>


{#await profile}
    <p>Loading...</p>
{:then profile} 
    <!-- Code goes here -->
{/await}
