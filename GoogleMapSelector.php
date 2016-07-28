<?php
/**
 * @author Dmitrij "m00nk" Sheremetjev <m00nk1975@gmail.com>
 * Date: 27.07.16, Time: 22:02
 */

namespace m00nk\googleMapSelector;

use yii\base\Widget;

class GoogleMapSelector extends Widget
{
	/** @var string ключ Google Browser API key (взять можно здесь: https://console.developers.google.com/apis/credentials) */
	public $googleMapApiKey;

	/** @var float дефолтовая широта */
	public $defaultLatitude = 48.114;

	/** @var float дефолтовая долгота */
	public $defaultLongitude = -122.763;

	/** @var string jQuery-селектор поля широты */
	public $latitudeSelector;

	/** @var string jQuery-селектор поля долготы */
	public $longitudeSelector;

	/** @var string jQuery-селектор поля названия объекта */
	public $titleSelector;

	/** @var string jQuery-селектор поля полного адреса */
	public $fullAddressSelector;

	/** @var string jQuery-селектор поля адреса */
	public $addressSelector;

	/** @var string jQuery-селектор поля города */
	public $citySelector;

	/** @var string jQuery-селектор поля почтового индекса */
	public $zipSelector;

	/** @var string jQuery-селектор поля страны */
	public $countrySelector;

	/** @var string jQuery-селектор поля штата */
	public $stateSelector;

	/** @var array опции поля поиска */
	public $searchFieldOptions = ['class' => 'form-control'];

	/** @var bool|string текст метки или FALSE если не нужна */
	public $label = false;

	/** @var array опции DIV-контейнера */
	public $options = [];

	/** @var array опции DIV'a карты */
	public $mapDivOptions = [];

	/** @var array опции автозаполнения. Описание: https://developers.google.com/maps/documentation/javascript/places-autocomplete?hl=ru */
	public $autoCompleteOptions = [
		'componentRestrictions' => ['country' => 'us']
	];

	public function run()
	{
		parent::run();

		if(!isset($this->options['id'])) $this->options['id'] = $this->id;
		if(!isset($this->mapDivOptions['id'])) $this->mapDivOptions['id'] = '_gmap_map_'.$this->id;
		if(!isset($this->mapDivOptions['style'])) $this->mapDivOptions['style'] = 'width: 100%; height: 500px;';

		return $this->render('default');
	}
}