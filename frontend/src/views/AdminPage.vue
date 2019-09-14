<template>
    <b-container fluid>
        <b-button @click="$emit('updateboards')">Test</b-button>
    </b-container>
</template>

<script>
export default {
    name: 'admin',
    mounted: function(){
        this.$on('updateboards',function(){
            alert('test');
        })
    }
}
</script>