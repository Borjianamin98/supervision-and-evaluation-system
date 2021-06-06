package ir.ac.sbu.evaluation.service.user;

import ir.ac.sbu.evaluation.dto.user.master.MasterDto;
import ir.ac.sbu.evaluation.dto.user.master.MasterSaveDto;
import ir.ac.sbu.evaluation.model.university.Faculty;
import ir.ac.sbu.evaluation.model.user.Master;
import ir.ac.sbu.evaluation.model.user.PersonalInfo;
import ir.ac.sbu.evaluation.repository.university.FacultyRepository;
import ir.ac.sbu.evaluation.repository.user.MasterRepository;
import ir.ac.sbu.evaluation.repository.user.PersonalInfoRepository;
import ir.ac.sbu.evaluation.repository.user.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class MasterService {

    private final PasswordEncoder passwordEncoder;

    private final UserRepository userRepository;
    private final PersonalInfoRepository personalInfoRepository;
    private final MasterRepository masterRepository;
    private final FacultyRepository facultyRepository;

    public MasterService(PasswordEncoder passwordEncoder,
            UserRepository userRepository,
            PersonalInfoRepository personalInfoRepository,
            MasterRepository masterRepository,
            FacultyRepository facultyRepository) {
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
        this.personalInfoRepository = personalInfoRepository;
        this.masterRepository = masterRepository;
        this.facultyRepository = facultyRepository;
    }

    public Page<MasterDto> retrieveMasters(String nameQuery, Pageable pageable) {
        return masterRepository.findByFirstNameContainsOrLastNameContains(nameQuery, nameQuery, pageable)
                .map(MasterDto::from);
    }

    @Transactional
    public MasterDto save(MasterSaveDto masterSaveDto) {
        if (userRepository.findByUsername(masterSaveDto.getUsername()).isPresent()) {
            throw new IllegalArgumentException("Username exists: ID = " + masterSaveDto.getUsername());
        }
        Faculty faculty = facultyRepository.findById(masterSaveDto.getFacultyId())
                .orElseThrow(() -> new IllegalArgumentException("Faculty not found: ID = "
                        + masterSaveDto.getFacultyId()));

        Master master = masterSaveDto.toMaster();
        master.setPassword(passwordEncoder.encode(master.getPassword()));
        master.setFaculty(faculty);

        PersonalInfo savedInfo = personalInfoRepository.save(master.getPersonalInfo());
        master.setPersonalInfo(savedInfo);

        return MasterDto.from(masterRepository.save(master));
    }

    public MasterDto retrieve(long userId) {
        return MasterDto.from(masterRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Master not found: ID = " + userId)));
    }
}
