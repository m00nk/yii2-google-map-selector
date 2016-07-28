<?php
/**
 * @author Dmitrij "m00nk" Sheremetjev <m00nk1975@gmail.com>
 * Date: 27.07.16, Time: 22:07
 */

use yii\web\View;
use m00nk\googleMapSelector\GoogleMapSelector;
use yii\helpers\Html;
use \yii\helpers\Json;

/**
 * @var View              $this
 * @var GoogleMapSelector $widget
 */

$widget = $this->context;

$widget->searchFieldOptions['id'] = '_gmap_search_'.$widget->id;

$searchFieldHtml = '';
if(!empty($widget->label))
	$searchFieldHtml = Html::tag('div', Html::label($widget->label).Html::textInput('', '', $widget->searchFieldOptions), ['class' => 'form-group']);
else
	$searchFieldHtml = Html::tag('div', Html::textInput('', '', $widget->searchFieldOptions), ['class' => 'form-group']);

$searchFieldHtml = Html::tag('div', $searchFieldHtml, ['class' => 'form-group']);

//-----------------------------------------
// загружаем необходимые скрипты и стили
\yii\web\JqueryAsset::register($this);
$this->registerCss('.pac-container{z-index: 1110; }');

$_ = $this->assetManager->publish($widget->getViewPath().'/assets');
$this->registerJsFile($_[1].'/googleMapSelector.js');
$this->registerJs('googleMapSelector.init('.Json::encode([
		'googleBrowserApiKey' => $widget->googleMapApiKey,
		'mapDivSelector' => '#'.$widget->mapDivOptions['id'],

		'defaultLatitude' => $widget->defaultLatitude,
		'defaultLongitude' => $widget->defaultLongitude,

		'latitudeInputSelector' => $widget->latitudeSelector,
		'longitudeInputSelector' => $widget->longitudeSelector,

		'titleInputSelector' => $widget->titleSelector,
		'fullAddressInputSelector' => $widget->fullAddressSelector,
		'addressInputSelector' => $widget->addressSelector,
		'cityInputSelector' => $widget->citySelector,
		'zipInputSelector' => $widget->zipSelector,
		'stateInputSelector' => $widget->stateSelector,
		'countryInputSelector' => $widget->countrySelector,

		'searchFieldSelector' => '#'.$widget->searchFieldOptions['id'],

		'autoCompleteOptions' => $widget->autoCompleteOptions,

		'searchFieldOptions' => ['class' => 'form-control', 'placeholder' => 'Enter a location, address or title of place']
	]).');', View::POS_READY);

echo Html::tag('div',
	$searchFieldHtml.
	Html::tag('div', '', $widget->mapDivOptions),
	$widget->options
);
