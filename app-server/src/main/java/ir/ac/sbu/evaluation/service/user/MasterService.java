package ir.ac.sbu.evaluation.service.user;

import ir.ac.sbu.evaluation.dto.user.MasterDto;
import ir.ac.sbu.evaluation.dto.user.UserDto;
import ir.ac.sbu.evaluation.model.user.Master;
import ir.ac.sbu.evaluation.model.user.PersonalInfo;
import ir.ac.sbu.evaluation.repository.user.MasterRepository;
import ir.ac.sbu.evaluation.repository.user.PersonalInfoRepository;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class MasterService {

    private final PasswordEncoder passwordEncoder;

    private final PersonalInfoRepository personalInfoRepository;
    private final MasterRepository masterRepository;

    public MasterService(PasswordEncoder passwordEncoder,
            PersonalInfoRepository personalInfoRepository,
            MasterRepository masterRepository) {
        this.passwordEncoder = passwordEncoder;
        this.personalInfoRepository = personalInfoRepository;
        this.masterRepository = masterRepository;
    }

    public List<UserDto> listAsUser() {
        return masterRepository.findAll().stream()
                .map(master -> UserDto.from(master, false))
                .collect(Collectors.toList());
    }

    @Transactional
    public MasterDto save(MasterDto masterDto) {
        Master master = masterDto.toMaster();
        master.setPassword(passwordEncoder.encode(master.getPassword()));

        if (master.getPersonalInfo() != null) {
            PersonalInfo savedInfo = personalInfoRepository.save(master.getPersonalInfo());
            master.setPersonalInfo(savedInfo);
        }
        return MasterDto.from(masterRepository.save(master));
    }
}
