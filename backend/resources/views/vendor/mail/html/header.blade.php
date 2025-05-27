@props(['url'])
<tr>
<td class="header">
<a href="{{ $url }}" style="display: inline-block;">
@if (trim($slot) === 'Laravel')
<img src="{{ asset('storage/images/pharmawise-logo.png') }}" class="logo" alt="PharmaWISE Logo">
@else
{{ $slot }}
@endif
</a>
</td>
</tr>