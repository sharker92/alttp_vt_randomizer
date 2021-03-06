@extends('layouts.default', ['title' => __('navigation.races') . ' - '])

@section('content')
<h1>{{ __('races.header') }}</h1>
<div class="card card-body bg-light">
    <div class="card border-info mt-4">
        <div class="card-header bg-info">
            <h3 class="card-title text-white">{{ __('races.cards.races.header') }}</h3>
        </div>
        <div class="card-body">
            @foreach (__('races.cards.races.sections') as $section)
            <h4>{{ $section['header'] }}</h4>
                @foreach ($section['content'] as $block)
                    <p>{!! $block !!}</p>
                @endforeach
            @endforeach
        </div>
    </div>

    <ins class="adsbygoogle" style="display:inline-block;width:100%;height:90px" data-ad-client="ca-pub-5161309967767506" data-ad-slot="9849787408"></ins>

    <div class="card border-info mt-4">
        <div class="card-header bg-info">
            <h3 class="card-title text-white">{{ __('races.cards.network.header') }}</h3>
        </div>
        <div class="card-body">
            @foreach (__('races.cards.network.content') as $block)
                <p>{!! $block !!}</p>
            @endforeach
        </div>
    </div>

    <div class="card border-info mt-4">
        <div class="card-header bg-info">
            <h3 class="card-title text-white">{{ __('races.cards.tournament.header') }}</h3>
        </div>
        <div class="card-body">
            @foreach (__('races.cards.tournament.sections') as $section)
            <h4>{{ $section['header'] }}</h4>
                @foreach ($section['content'] as $block)
                    <p>{!! $block !!}</p>
                @endforeach
            @endforeach
        </div>
    </div>
</div>
@overwrite
