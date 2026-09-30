package backend.ride_offer;

import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import backend.exceptions.EntityNotFoundException;
import backend.ride_offer.dto.CreateRideOfferDto;
import backend.ride_offer.dto.FilterRideOfferDto;
import backend.ride_offer.dto.RideOfferDto;
import backend.user.User;

@Service 
public class RideOfferService {
    private final RideOfferRepository rideOfferRepository;

    public RideOfferService(RideOfferRepository rideOfferRepository) {
        this.rideOfferRepository = rideOfferRepository;
    }

    public void create(CreateRideOfferDto rideOfferDto, User user) {
        RideOffer rideOffer = new RideOffer();

        //verificar antes de criar a de retorno
        if(rideOfferDto.roundTrip()) {
            this.createReturn(rideOfferDto, user);
        }

        rideOffer.setUser(user);
        rideOffer.setSeats_capacity(rideOfferDto.seatsCapacity()); //tem que ser menor ou igual que a capacidade do veiculo vinculado
        rideOffer.setDepartureDateTime(rideOfferDto.departureDateTime());
        rideOffer.setDescription(rideOfferDto.description());
        rideOffer.setDestination(rideOfferDto.destination());
        rideOffer.setOrigin(rideOfferDto.origin());
        rideOffer.setVehicle(rideOfferDto.vehicle());
        rideOffer.setStatus(StatusOffer.AVAILABLE);

        rideOfferRepository.save(rideOffer);
    }

    public void createReturn(CreateRideOfferDto rideOfferDto, User user) {
        RideOffer rideOffer = new RideOffer();

        rideOffer.setUser(user);
        rideOffer.setSeats_capacity(rideOfferDto.seatsCapacity());
        rideOffer.setDepartureDateTime(rideOfferDto.returnDateTime()); //troca
        rideOffer.setDescription(rideOfferDto.description());
        rideOffer.setDestination(rideOfferDto.origin()); //troca
        rideOffer.setOrigin(rideOfferDto.destination()); //troca
        rideOffer.setVehicle(rideOfferDto.vehicle());
        rideOffer.setStatus(StatusOffer.AVAILABLE);

        rideOfferRepository.save(rideOffer);
    }

    public RideOfferDto get(Long rideOfferId) {
        RideOffer rideOffer = rideOfferRepository.findById(rideOfferId)
            .orElseThrow(EntityNotFoundException::new);

        return new RideOfferDto(rideOffer);
    }

    public List<RideOfferDto> getAll(FilterRideOfferDto filter) {
        return rideOfferRepository
            .findAll(RideOfferSpecs.withFilter(filter), Sort.by("departureDateTime").ascending())
            .stream()
            .map(RideOfferDto::new)
            .toList();
    }

    //regras quando o usuário não pode cancelar? 
    public void cancel(Long rideOfferId, User user){
        RideOffer rideOffer = rideOfferRepository.findByIdAndUser(rideOfferId, user)
            .orElseThrow(EntityNotFoundException::new);

        rideOffer.setStatus(StatusOffer.CANCELLED);
        rideOfferRepository.save(rideOffer);
    } //será que precisaremos de observers ? Suponho que precisaremos notificar os passageiros

    //regras sobre caronas no mesmo dia ou mesmo horário ou limite de tempo tipo só pode criar uma carona para daqui no máximo 2 semanas. Se tiver um vinculado as vagas não pode passar da capacidade do veículo

}
