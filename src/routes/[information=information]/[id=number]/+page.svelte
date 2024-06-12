<script lang="ts">
    import { onMount } from 'svelte';

    let character;
    onMount(async () => {
        const response = await fetch('https://eve-kill.com/api/characters/97050631');
        character = await response.json();

        console.log(character);
    });
</script>

{#if character}
<div class="container mx-auto p-4 text-white">
    <!-- Profile Section -->
    <div class="flex items-start">
        <!-- Profile Image with Additional Images -->
        <div class="flex items-center">
            <img
                src="https://images.evetech.net/characters/{character.character_id}/portrait?size=256"
                alt="Character: {character.name}"
                class="rounded-full"
            />
            <div class="flex flex-col space-x-2 space-y-2">
                <img
                    src="https://images.evetech.net/corporations/{character.corporation_id}/logo?size=64"
                    alt="Corporation: {character.corporation_name}"
                    class="rounded-full"
                />
                <img
                    src="https://images.evetech.net/alliances/{character.alliance_id}/logo?size=64"
                    alt="Alliance: {character.alliance_name}"
                    class="rounded-full"
                />
                <img
                    src="https://images.evetech.net/corporations/{character.faction_id}/logo?size=64"
                    alt="Faction: {character.faction_name}"
                    class="rounded-full"
                />
            </div>
        </div>

        <!-- Profile Information Tables -->
        <div class="w-2/3 flex justify-between ml-5">
            <!-- First Table next to the image -->
            <div>
                <table class="table-auto">
                    <tbody>
                    <tr>
                        <td class="font-bold">Name:</td>
                        <td>John Doe</td>
                    </tr>
                    <tr>
                        <td class="font-bold">Username:</td>
                        <td>@johndoe</td>
                    </tr>
                    <tr>
                        <td class="font-bold">Location:</td>
                        <td>San Francisco, CA</td>
                    </tr>
                    <tr>
                        <td class="font-bold">Joined:</td>
                        <td>January 2020</td>
                    </tr>
                    <tr>
                        <td class="font-bold">Followers:</td>
                        <td>1,234</td>
                    </tr>
                    <tr>
                        <td class="font-bold">Followers:</td>
                        <td>1,234</td>
                    </tr>
                    <tr>
                        <td class="font-bold">Followers:</td>
                        <td>1,234</td>
                    </tr>
                    <tr>
                        <td class="font-bold">Followers:</td>
                        <td>1,234</td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div>
                <table class="table-auto">
                    <tbody>
                    <tr>
                        <td class="font-bold">Email:</td>
                        <td>johndoe@example.com</td>
                    </tr>
                    <tr>
                        <td class="font-bold">Phone:</td>
                        <td>(123) 456-7890</td>
                    </tr>
                    <tr>
                        <td class="font-bold">Website:</td>
                        <td>www.johndoe.com</td>
                    </tr>
                    <tr>
                        <td class="font-bold">Birthday:</td>
                        <td>January 1, 1990</td>
                    </tr>
                    <tr>
                        <td class="font-bold">Occupation:</td>
                        <td>Software Engineer</td>
                    </tr>
                    <tr>
                        <td class="font-bold">Occupation:</td>
                        <td>Software Engineer</td>
                    </tr>
                    <tr>
                        <td class="font-bold">Occupation:</td>
                        <td>Software Engineer</td>
                    </tr>
                    <tr>
                        <td class="font-bold">Occupation:</td>
                        <td>Software Engineer</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- Navbar -->
    <div class="mt-4">
        <nav class="bg-gray-800 text-white py-2 px-4 rounded">
            <ul class="flex space-x-4">
                <li><a href="#" class="hover:underline">Kills</a></li>
                <li><a href="#" class="hover:underline">Losses</a></li>
            </ul>
        </nav>
    </div>

    <!-- Information Box -->
    <div class="mt-4 p-4 rounded">
        user inner components here to load different types of data..
    </div>
</div>
{/if}
